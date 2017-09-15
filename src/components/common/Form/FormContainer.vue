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
      let [field, data] = name.split(':')

      if (data) {

      }

      this.$store.dispatch(`form/${this.name}/UPDATE_FIELD_VALUE`, {
        mutation: 'SET_' + field.toUpperCase(),
        value: value,
        data
      })
    })
  },

  updated() {
    this.passDataToFields(this.$slots.default)
  },

  methods: {
    passDataToFields(slots) {
      if (slots && slots.length) {
        slots.forEach((slot) => {
          if (slot.tag && slot.tag.indexOf('form-field') > -1) {
            slot.componentInstance.stateName = this.name
          } else {
            if (slot && slot.componentInstance && slot.componentInstance.$slots && slot.componentInstance.$slots.default) {
              this.passDataToFields.bind(this)(slot.componentInstance.$slots.default)
            }
          }
        })
      }
    }
  }
}
</script>