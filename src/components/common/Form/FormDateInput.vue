<template>
  <form-text-input @input="$emit('input', $event)" v-bind="$attrs" v-on="$listeners"></form-text-input>
</template>

<script>
export default {
  name: 'form-date-input',

  props: {
    name: {
      default: undefined
    },

    value: {
      default: null
    }
  }
}
</script>