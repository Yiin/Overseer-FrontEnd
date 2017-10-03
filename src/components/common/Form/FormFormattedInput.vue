<template>
  <div
    :class  = "{
      'form__input--label-left': labelPosition === 'left',
      'form__input--label-right': labelPosition === 'right'
    }"
   :data-label = "label"
  >
    <input @input   = "onInput"
           @change  = "onChange"
           v-model  = "localValue"
           class    = "form__input"
           type     = "text"
           :name    = "name"
           ref      = "input"
           :readonly = "readonly"
    >
  </div>
</template>

<script>
import debounce from 'debounce'
import Cleave from 'cleave.js'

export default {
  name: 'form-text-input',

  props: {
    name: {
      type: String,
      default: undefined
    },

    value: {
      default: null
    },

    label: {
      type: String
    },

    labelPosition: {
      type: String,
      default: 'left'
    },

    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localValue: this.value,
      cleave: null
    }
  },

  watch: {
    value: function (value) {
      this.localValue = value
    }
  },

  updated() {
    if (!this.$refs.input) {
      return
    }
    this.$refs.input.type = 'text'
  },

  mounted() {
    this.$refs.input.type = 'text'
    this.cleave = new Cleave(this.$refs.input, {
      numeral: true,
      numeralDecimalScale: Number.MAX_SAFE_INTEGER
    })
    this.onChange({
      target: {
        value: this.localValue
      }
    })
  },

  methods: {
    onInput: debounce(function (event) {
      this.$emit('input', event.target.value)
    }, 200),

    onChange(e) {
      const val = e.target.value

      if (!val) {
        this.localValue = '0.00'
        return
      }
      let suffix = val.match(/\.\d*$/g)
      let fixedVal = val

      if (suffix) {
        suffix = suffix[0]

        let missing = 3 - suffix.length

        while (missing--) {
          fixedVal += '0'
        }
      } else {
        fixedVal += '.00'
      }

      if (fixedVal !== val) {
        this.localValue = fixedVal
      }
    }
  }
}
</script>

<style lang="scss">
.form__input--label-left,
.form__input--label-right {
  position: relative;
  width: 100%;
}

.form__input--label-left input {
  padding-left: 56px;
}
.form__input--label-right input {
  padding-right: 56px;
}

.form__input--label-left::before,
.form__input--label-right::before {
  content: attr(data-label);
  font-size: 16px;
  position: absolute;
  display: flex;
  top: 0;
  height: 44px;
  width: 56px;
  justify-content: center;
  align-items: center;
  color: $color-mine-shaft;
}

.form__input--label-left::before {
  left: 0;
}

.form__input--label-right::before {
  right: 0;
}
</style>