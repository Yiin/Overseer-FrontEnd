<template lang="pug">
  div(
    v-if  = 'readonly'
    class = 'form__input'
  ) {{ value }}

  input(
    v-else
    @input  = 'onInput'
    v-model = 'valueProxy'
    v-bind  = '$attrs'
    class   = 'form__input'
    type    = 'text'
    :name   = 'name'
  )
</template>

<script>
import debounce from 'debounce'

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

    readonly: {
      type: Boolean,
      default: false
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