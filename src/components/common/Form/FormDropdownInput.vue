<template>
  <dropdown @input = "onInput"
            v-bind = "$attrs"
            v-model= "valueProxy"
  >
    <slot></slot>
  </dropdown>
</template>

<script>
export default {
  name: 'form-dropdown-input',

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
    onInput(event) {
      this.$emit('input', event)
    }
  }
}
</script>