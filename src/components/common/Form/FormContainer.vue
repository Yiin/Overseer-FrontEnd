<template>
  <div class = "form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'form-container',

  props: {
    name: {
      type: String,
      required: true
    }
  },

  mounted() {
    this.$on('input:field', ({ name, value }) => {
      this.$store.dispatch(`form/${this.name}/UPDATE_FIELD_VALUE`, {
        mutation: 'SET_' + name.toUpperCase(),
        value: value
      })
    })

    this.passDataToFields(this.$slots.default)
  },

  methods: {
    passDataToFields(slots) {
      slots.forEach((slot) => {
        if (slot.tag && slot.tag.indexOf('form-field') > -1) {
          slot.stateName = this.name
        } else if (slot.$slots && slots.$slots.default) {
          slot.$slots.default.forEach(this.passDataToFields.bind(this))
        }
      })
    }
  }
}
</script>