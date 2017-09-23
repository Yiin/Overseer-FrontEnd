<template>
  <input @input  = "onInput"
         v-model = "valueProxy"
         class   = "form__input"
         type    = "text"
         :name   = "name"
  >
</template>

<script>
import debounce from 'debounce'

export default {
  name: 'form-date-input',

  props: {
    name: {
      type: String,
      default: undefined
    },

    value: {
      default: null
    }
  },

  data() {
    return {
      valueProxy: this.value
    }
  },

  watch: {
    value: function (value) {
      this.valueProxy = value
    }
  },

  methods: {
    onInput: debounce(function (event) {
      this.$emit('input', event.target.value)
    }, 200)
  }
}
</script>