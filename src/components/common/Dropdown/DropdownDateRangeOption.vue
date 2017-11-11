<template>
  <div
    class="dropdown__option dropdown__option--numeric"
    v-clickaway="blur"
    @blur="blur"
    :class="{ 'dropdown__option--open': isOpen }"
    :tabindex="name"
  >
    <div
      @mousedown="isOpen = !isOpen"
      class="dropdown-numeric-option__header mediumjs-input"
      :class="{ 'mediumjs-input--empty': isEmpty }"
    >
      {{ displayText }}
    </div>
    <div
      @click="clear"
      class="mediumjs-input-clear"
    ></div>

    <div class="dropdown-numeric-option__body">
      <div class="value-input">
        <label>{{ $t('labels.range_from') }}</label>
        <form-date-input v-model="startDate" clearable></form-date-input>
      </div>
      <div class="value-input">
        <label>{{ $t('labels.range_to') }}</label>
        <form-date-input v-model="endDate" clearable></form-date-input>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'dropdown-numeric-option',

  props: ['name', 'placeholder'],

  data() {
    return {
      isOpen: false,
      from: null,
      to: null
    }
  },

  computed: {
    isEmpty() {
      return (!this.from || !this.from.isValid()) && (!this.to || !this.to.isValid())
    },

    startDate: {
      get() {
        return this.from && (this.from.isValid() || null) && this.from.format('YYYY-MM-DD')
      },
      set(value) {
        this.from = moment(value)
      }
    },

    endDate: {
      get() {
        return this.to && (this.to.isValid() || null) && this.to.format('YYYY-MM-DD')
      },
      set(value) {
        this.to = moment(value)
      }
    },

    displayText() {
      if (!this.isOpen && (this.from || this.to)) {
        const from = this.from && this.from.isValid() && this.from.format('MMM D, YYYY')
        const to = this.to && this.to.isValid() && this.to.format('MMM D, YYYY')

        if (from && to) {
          return `${from} - ${to}`
        } else if (from) {
          return `${from} - `
        } else if (to) {
          return `- ${to}`
        }
      }
      return this.placeholder
    },

    value() {
      if (this.from || this.to) {
        return {
          from: this.from || null,
          to: this.to || null
        }
      } else {
        return null
      }
    }
  },

  watch: {
    from(value) {
      if (this.to && value && value.isAfter(this.to)) {
        this.to = null
      }
      this.onInput()
    },
    to(value) {
      if (this.from && value && value.isBefore(this.from)) {
        this.from = null
      }
      this.onInput()
    }
  },

  methods: {
    blur() {
      this.isOpen = false
    },

    clear() {
      this.from = null
      this.to = null
      this.blur()
      this.onInput()
    },

    onInput() {
      this.$emit('input-changed')
    },

    getValue() {
      return this.value
    }
  }
}
</script>

<style lang="scss">
.dropdown__option--numeric {
  .date__input {
    position: initial;
    .datePicker {
      width: auto !important;
      right: 268px;
      top: 0px;
    }
    .form__input {
      background: transparent;
      border: none;
      border-bottom: 2px solid $color-white;
      display: block;
      padding: 4px;
      color: $color-white;
      font-size: 16px;
      font-weight: 600;
      width: 215px;
      height: 32px;
      padding-left: 0;
      &:focus {
        outline: none;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.dropdown__option--numeric {
    position: relative;
    display: block;
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
    overflow: visible;
    visibility: visible;
}

.dropdown__option--open {
    background: $color-main;
}

.value__input {
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