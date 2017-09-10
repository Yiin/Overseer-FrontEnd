<template>
  <inline-select @input = "onInput"
                 :name="name"
                 v-bind = "$attrs"
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