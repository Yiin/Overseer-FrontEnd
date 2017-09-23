<template>
  <dropdown :watch="watch" ref="dropdown" v-model="value" @input="onInput" :placeholder="placeholder">
    <slot></slot>
  </dropdown>
</template>

<script>
export default {
  name: 'inputs-dropdown',

  props: {
    placeholder: {
      type: String,
      default: ''
    },
    watch: {
      default: null
    }
  },

  data() {
    return {
      value: {}
    }
  },

  methods: {
    onInput(e) {
      this.$emit('input', e)
    }
  }
}
</script>