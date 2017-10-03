<template>
  <inline-select @input    = "onInput"
                 v-model   = "proxyValue"
                 v-bind    = "$attrs"
                 :readonly = "readonly"
                 :name     = "name"
  >
    <template v-if="!readonly" slot="head">
      <slot name="head"></slot>
    </template>
    <template slot="rows">
      <slot name="rows"></slot>
    </template>
    <slot></slot>
    <template slot="placeholder">
      <slot name="placeholder"></slot>
    </template>
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
    },

    readonly: {
      type: Boolean,
      default: false
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
      // this.$emit('input', payload)
    }
  }
}
</script>