<template>
  <dropdown ref="dropdown" @input="onInput" :placeholder="placeholder">
    <slot></slot>
  </dropdown>
</template>

<script>
export default {
  name: 'inputs-dropdown',

  props: ['placeholder'],

  methods: {
    onInput() {

    }
  }
}
</script>