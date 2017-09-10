<template>
  <div class = "form__inline-inputs">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'form-row',

  computed: {
    fields() {
      return this.$slots.default
        ? this.$slots.default
          .filter((slot) => slot.tag && slot.tag.indexOf('form-field') > -1)
          .map((el) => el.componentInstance)
        : []
    }
  },

  mounted() {
    this.fields.forEach((field) => {
      field.$on('input', (value) => {
        if (this.$parent) {
          this.$parent.$emit('input:field', value)
        }
        this.$emit('input', value)
      })
    })
  }
}
</script>