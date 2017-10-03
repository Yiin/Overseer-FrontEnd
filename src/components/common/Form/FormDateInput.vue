<template>
  <date-picker
    @input  = "onInput"
    v-model = "valueProxy"
    v-bind  = "$attrs"
  ></date-picker>
</template>

<script>
// import debounce from 'debounce'
import moment from 'moment'
import DatePicker from '@/components/common/DatePicker/DatePicker.vue'

export default {
  name: 'form-date-input',

  components: {
    DatePicker
  },

  props: {
    name: {
      type: String,
      default: undefined
    },

    value: {
      default: null
    },

    currentDate: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      valueProxy: this.value ? moment(this.value) : this.currentDate ? moment() : undefined,
      customValue: false
    }
  },

  watch: {
    value: function (value) {
      if (!this.customValue) {
        this.valueProxy = moment(value)
      }
    }
  },

  mounted() {
    if (!this.value) {
      this.onInput(this.valueProxy, false)
    }
  },

  methods: {
    onInput(input, isCustom = true) {
      if (isCustom) {
        this.customValue = true
      }
      this.$emit('input', input ? moment(input).format('YYYY-MM-DD') : null)
    }
  }
}
</script>