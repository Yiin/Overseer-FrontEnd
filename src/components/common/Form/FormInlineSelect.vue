<template>
  <inline-select @input  = "onInput"
                 v-model = "proxyValue"
                 v-bind  = "$attrs"
                 :name   = "name"
  >
    <template slot="head">
      <slot name="head"></slot>
    </template>
    <template slot="rows">
      <slot name="rows"></slot>
    </template>
    <slot></slot>
  </inline-select>
</template>

<script>
export default {
  name: 'form-inline-select-input',

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
      proxyValue: this.value
    }
  },

  watch: {
    value: function (value) {
      this.proxyValue = value
    }
  },

  methods: {
    onInput(value) {
      const payload = {
        name: this.name,
        value: value
      }
      if (this.$parent) {
        this.$parent.$emit('input:field', payload)
      }
      this.$emit('input', payload)
    }
  }
}
</script>