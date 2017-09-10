<template>
  <textarea @input = "onInput"
            class  = "form__input"
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

  methods: {
    onInput: debounce(function (event) {
      this.$emit('input', event.target.value)
    }, 300)
  }
}
</script>