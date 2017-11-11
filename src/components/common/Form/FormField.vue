<template>
  <div class = "form__input-wrapper">

    <label class = "form__label">
      {{ label }}

      <span v-for = "error in errors"
            class = "form__input-error"
      >
        {{ error }}
      </span>
    </label>
    <slot></slot>

  </div>
</template>

<script>
export default {
  name: 'form-field',

  props: {
    label: {
      type: String,
      default: undefined
    },
    errors: {
      type: Array,
      default: () => []
    }
  }
}
</script>