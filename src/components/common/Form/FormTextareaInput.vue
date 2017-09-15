<template>
  <textarea @input  = "onInput"
            v-model = "valueProxy"
            class   = "form__input"
  ></textarea>
</template>

<script>
import debounce from 'debounce'

export default {
  name: 'form-textarea-input',

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
    }, 300)
  }
}
</script>