<template>
  <span
    v-if="this.vatNumber"
    class="vat --do-not-toggle-row"
    :class="{
      'vat--verified': this.status === 'valid',
      'vat--pending': this.status === 'pending',
      'vat--invalid': this.status === 'invalid'
    }"
    @mouseover="onHover"
    @mouseleave="onLeave"
    v-tooltip="{ content, placement: 'right', classes: tooltipClasses, trigger }"
    v-clickaway="close"
    @click="check"
  >
  <template v-if="status === 'pending'">
    verify
  </template>
  <template v-if="status === 'invalid'">
    retry
  </template>
  </span>
</template>

<script>
import moment from 'moment'
import { EventBus } from '@/events'

export default {
  props: ['client', 'vat'],

  data() {
    return {
      trigger: 'hover focus',
      hovering: false,
      disabled: false
    }
  },

  computed: {
    vatNumber() {
      return this.vat || (this.client ? this.client.vat_number : null)
    },

    result() {
      const result = this.$store.state.features.vat_checker.results.find((result) => {
        return result.country_code + result.number === this.vatNumber
      })
      if (result) {
        result.checked_time_ago = moment(result.created_at).fromNow()
      }
      return result
    },

    status() {
      const result = this.result

      if (!result) {
        return 'pending'
      }
      return result.status
    },

    tooltipClasses() {
      let classes = [
        'status--' + this.status
      ]

      if (this.disabled) {
        classes.push('disabled')
      }

      return classes
    },

    content() {
      const result = this.result

      if (!result) {
        return ''
      }

      const resultClass = result.status === 'valid' ? 'result--success' : 'result--failure'

      let html = `
        <div class = "result ${resultClass}">
          <div class="result-border"></div>
          <div class="result-details">
            <div class="result-detail">
              VAT: <span class="result-detail__value">${result.country_code + result.number}</span>
            </div>
            <div class="result-detail result-detail--highlight">
              Status: <span class="result-detail__value">${this.$t('vat_status.' + result.status)}</span>
            </div>
            <div class="result-detail-main">
      `

      if (result.name) {
        html += `
              <div v-if="result.name" class="result-detail__title">
                ${result.name}
              </div>
        `
      }
      if (result.address) {
        html += `
              <div v-if="result.address" class="result-detail__sub-title">
                ${result.address}
              </div>
        `
      }
      html += `
            </div>
            <div class="result-detail">
              Checked <span class="result-detail__value">${result.checked_time_ago}</span>
            </div>
          </div>
        </div>
      </div>
      `
      return html
    }
  },

  mounted() {
    EventBus.$on('hide-tooltips', this.close)
    EventBus.$on('disable-tooltips', this.disable)
    EventBus.$on('enable-tooltips', this.enable)
  },

  destroyed() {
    EventBus.$off('hide-tooltips', this.close)
    EventBus.$off('disable-tooltips', this.disable)
    EventBus.$off('enable-tooltips', this.enable)
  },

  methods: {
    check() {
      this.hovering = true

      EventBus.$emit('disable-tooltips')
      this.disabled = false

      if (this.status === 'valid') {
        this.$el._tooltip.show()
        this.trigger = 'manual'
      }

      this.$store.dispatch('features/vat_checker/CHECK_VAT', {
        country_code: this.vatNumber.substr(0, 2),
        number: this.vatNumber.substr(2)
      }).then(() => {
        this.trigger = 'manual'
        this.$el._tooltip.show()

        setTimeout(() => {
          EventBus.$emit('enable-tooltips')
          if (!this.hovering) {
            this.$el._tooltip.hide()
          }
          this.trigger = 'hover focus'
        }, 3000)
      })
    },

    onHover() {
      this.hovering = true
    },

    onLeave() {
      this.hovering = false
    },

    close() {
      if (this.$el && this.$el._tooltip) {
        this.$el._tooltip.hide()
      }
    },

    disable() {
      this.disabled = true
    },

    enable() {
      this.disabled = false
    }
  }
}
</script>

<style lang="scss">
.tooltip.disabled {
  display: none !important;
}

.vat {
  position: absolute;
  top: 15px;
  right: 20px;
  width: 65px;
  height: 23px;
  padding-bottom: 1px;
  cursor: pointer;
  user-select: none;
  transform: scale(0.9);

  &--verified {
    height: 24px;
    background: url(../../assets/icons/vat-verified.svg) center center no-repeat;
    background-size: contain;
  }
  &--pending, &--invalid {
    font-weight: 800;
    font-size: 13px;
    text-transform: capitalize;
    border-radius: 4px;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 0.9px;
  }
  &--pending {
    background: $color-main;
    // @include gradient-background;
  }
  &--invalid {
    background: #000000;
  }
}
</style>