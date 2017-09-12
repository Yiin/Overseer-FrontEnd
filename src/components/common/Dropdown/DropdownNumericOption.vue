<template>
  <div class="dropdown__option dropdown__option--numeric"
       v-clickaway="blur"
       @blur="blur"
       :class="{ 'dropdown__option--open': isOpen }"
       :tabindex="name">

    <div class="dropdown-numeric-option__header mediumjs-input"
         :class="{ 'mediumjs-input--empty': isEmpty }"
         @mousedown="click()">
        {{ displayText }}
    </div>
    <div @click="clear"
         class="mediumjs-input-clear"
    ></div>

    <div class="dropdown-numeric-option__body">
      <div class="value-input">
        <label @click="click('from')">{{ $t('labels.range_from') }}</label>
        <input v-model="from" ref="from" type="text" class="value__input">
      </div>
      <div class="value-input">
        <label @click="click('to')">{{ $t('labels.range_to') }}</label>
        <input v-model="to" ref="to" type="text" class="value__input">
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'dropdown-numeric-option',

  props: ['name', 'placeholder'],

  data() {
    return {
      isOpen: false,
      from: '',
      cleaveFrom: null,
      to: '',
      cleaveTo: null
    }
  },

  computed: {
    isEmpty() {
      return !(this.from || this.to)
    },

    displayText() {
      const from = numeral(parseFloat(this.from)).format('0,[0000]')
      const to = numeral(parseFloat(this.to)).format('0,[0000]')

      if (!this.isOpen) {
        if (this.from && this.to) {
          return `${from} - ${to}`
        } else if (this.from) {
          return `${from} - `
        } else if (this.to) {
          return `- ${to}`
        }
      }
      return this.placeholder
    }
  },

  methods: {
    click(target) {
      if (target) {
        this.focus(target, 0)
      } else {
        this.isOpen = !this.isOpen
        if (this.isOpen) {
          this.focus('from')
        }
      }
    },

    focus(target, delay = 200) {
      // return setTimeout(() => window.requestAnimationFrame(() => this.$refs[target].focus()), delay)
    },

    blur() {
      this.isOpen = false
    },

    clear() {
      this.from = ''
      this.to = ''
      this.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown__option--numeric {
    position: relative;
}

.dropdown__option--numeric.dropdown__option--open {
    background: $color-main;
    color: $color-white;
    padding-bottom: 30px;
}

.dropdown-numeric-option__body {
    transition: max-height 0.2s;
    max-height: 0px;
    overflow: hidden;
    visibility: hidden;
}

.dropdown__option--open .dropdown-numeric-option__body {
    max-height: 134px;
    visibility: visible;
}

.dropdown__option--open {
    background: $color-main;
}

.value__input {
    background: transparent;
    border: none;
    border-bottom: 2px solid $color-white;
    display: block;
    padding: 4px;
    color: $color-white;
    font-size: 16px;
    font-weight: 600;
    max-width: 215px;
    padding-left: 10px;
}

.value__input:focus {
    outline: none;
}

label {
    font-size: 12px;
    font-weight: 800;
    font-style: italic;
    display: block;
    line-height: 16px;
}

.dropdown-numeric-option__header:not(.mediumjs-input--empty) {
    font-weight: $font-weight-semibold;
    color: $color-main;
}

.dropdown__option--open .dropdown-numeric-option__header {
    font-weight: $font-weight-semibold;
    color: $color-text-alt;
}

.value-input {
    margin-top: 10px;
}
</style>