<template lang="pug">
  .form__input-wrapper

    label.form__label {{ label }}

      //- v-tooltip(v-if='hint' top)
      //-   v-icon(slot='activator') info
      //-   span {{ hint }}

      span(
        v-for='error in errors'
        class='form__input-error'
      ) {{ error }}

    slot
</template>

<script>
export default {
  name: 'form-field',

  props: {
    label: {
      type: String,
      default: undefined
    },
    hint: {
      type: String,
      default: null
    },
    errors: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>
.form__label > .tooltip {
  display: inline !important;
}
</style>