<template lang="pug">
  .date__input(v-clickaway='hide')
    input.form__input(
      type='text'
      v-model='formattedValue'
      @focus='show'
    )
    v-date-picker(
      landscape
      class='datePicker'
      v-show='isOpen'
      @input='hide'
      v-model='localValue'
      scrollable
      actions
    )
</template>

<script>
import moment from 'moment'
import DateFormatsMixin from '@/mixins/date/formats'

function parseDateValue(value, currentDate) {
  let localValue = null

  if (value) {
    if (value instanceof moment) {
      localValue = value.format('YYYY-MM-DD')
    } else if (typeof value === 'object') {
      localValue = moment(value.date).format('YYYY-MM-DD')
    } else if (value !== 'Invalid date') {
      localValue = moment(value).format('YYYY-MM-DD')
    }
  } else if (currentDate) {
    localValue = moment().format('YYYY-MM-DD')
  }

  if (localValue === 'Invalid date') {
    localValue = null
  }

  return localValue
}

export default {
  mixins: [
    DateFormatsMixin
  ],

  props: {
    currentDate: {
      type: Boolean,
      default: false
    },

    clearable: {
      type: Boolean,
      default: false
    },

    value: {}
  },

  data() {
    return {
      isOpen: false,
      localValue: parseDateValue(this.value, this.currentDate),
      separator: '/'
    }
  },

  watch: {
    localValue(value) {
      this.$emit('input', value)
    },

    value(value) {
      this.localValue = parseDateValue(value, false)
    }
  },

  computed: {
    formattedValue: {
      get() {
        if (!this.localValue) {
          return ''
        }
        const date = moment(this.localValue)
        if (!date.isValid()) {
          return ''
        }
        return date.format(this.DATE_INPUT_FORMAT)
      },
      set(value) {
        if (value.length !== this.DATE_INPUT_FORMAT.length) {
          if (this.clearable && !value.length) {
            this.localValue = null
          }
          return
        }
        value.replace(/-/g, '/')
        value.replace(/ /g, '/')
        value.replace(/\./g, '/')

        const date = moment(value, this.DATE_INPUT_FORMAT)

        if (date.isValid()) {
          this.localValue = moment(date).format('YYYY-MM-DD')
        }
      }
    }
  },

  mounted() {
    if (this.localValue && this.value !== this.localValue) {
      this.$emit('input', this.localValue)
    }
  },

  methods: {
    show() {
      this.isOpen = true
    },

    hide() {
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss">
.date__input {
  position: relative;

  .datePicker {
    position: absolute;
    z-index: 2;
    line-height: initial;
    width: 100%;
  }
}
</style>