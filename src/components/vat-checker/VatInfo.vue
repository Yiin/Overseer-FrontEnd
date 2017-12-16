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
    v-tooltip="{ content, placement: 'right', classes: tooltipClasses, trigger: 'manual' }"
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
      disabled: false,
      onLeaveBinded: this.onLeave.bind(this)
    }
  },

  computed: {
    vatNumber() {
      return this.vat.vatNumber || (this.client ? this.client.vat_number : null)
    },

    result() {
      const result = this.vat.getLatestInfo()

      if (result.status === 'pending') {
        return null
      }

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
        'tooltip--vat-info',
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
              VAT: <span class="result-detail__value">${result.countryCode + result.number}</span>
            </div>
            <div class="result-detail result-detail--highlight">
              Status: <span class="result-detail__value">${this.$t('vat_status.' + result.status)}</span>
            </div>
            <div class="result-detail-main">
      `

      if (result.companyName) {
        html += `
              <div v-if="result.companyName" class="result-detail__title">
                ${result.companyName}
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
    EventBus.$on('hide-tooltips', this.hideTooltip)
    EventBus.$on('disable-tooltips', this.disable)
    EventBus.$on('enable-tooltips', this.enable)
  },

  destroyed() {
    EventBus.$off('hide-tooltips', this.hideTooltip)
    EventBus.$off('disable-tooltips', this.disable)
    EventBus.$off('enable-tooltips', this.enable)
  },

  methods: {
    check() {
      EventBus.$emit('disable-tooltips')
      this.disabled = false

      if (this.status === 'valid') {
        this.showTooltip()
      }

      this.vat.check().then(() => {
        this.showTooltip()

        setTimeout(() => {
          EventBus.$emit('enable-tooltips')
          if (!this.isTooltipHovered()) {
            this.hideTooltip()
          }
        }, 3000)
      })
    },

    /**
     * Check if we're hovering tooltip
     */
    isTooltipHovered() {
      if (this.disabled) {
        return false
      }
      if (!this.$el._tooltip) {
        return false
      }
      if (!this.$el._tooltip.popperInstance) {
        return false
      }
      if (!this.$el._tooltip.popperInstance.popper) {
        return false
      }

      /**
       * Check if we're hovering trigger button
       */
      const triggerBtn = this.$el

      if (triggerBtn && triggerBtn.parentElement && triggerBtn.parentElement.querySelector(':hover') === triggerBtn) {
        return true
      }

      /**
       * Check if we're hovering the tooltip itself
       */
      const tooltip = this.$el._tooltip.popperInstance.popper

      if (tooltip && tooltip.parentElement && tooltip.parentElement.querySelector(':hover') === tooltip) {
        return true
      }

      return false
    },

    onHover() {
      if (this.disabled) {
        return
      }

      this.showTooltip()
    },

    onLeave() {
      setTimeout(() => {
        if (this.isTooltipHovered()) {
          this.$el._tooltip.popperInstance.popper.addEventListener('mouseleave', this.onLeaveBinded)
          return
        } else {
          this.hideTooltip()
        }
      }, 300)
    },

    showTooltip() {
      if (this.$el && this.$el._tooltip) {
        EventBus.$emit('hide-tooltips')
        this.$el._tooltip.show()
      }
    },

    hideTooltip() {
      if (this.$el && this.$el._tooltip) {
        if (this.$el._tooltip.popperInstance && this.$el._tooltip.popperInstance.popper) {
          this.$el._tooltip.popperInstance.popper.removeEventListener('mouseleave', this.onLeaveBinded)
        }
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