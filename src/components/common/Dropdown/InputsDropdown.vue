<template>
  <dropdown ref="dropdown" @input="onInput" :placeholder="placeholder" :primary="primary">
    <slot></slot>
  </dropdown>
</template>

<script>
export default {
  name: 'inputs-dropdown',

  props: ['placeholder', 'primary'],

  methods: {
    onInput() {

    }
  }
}
</script>