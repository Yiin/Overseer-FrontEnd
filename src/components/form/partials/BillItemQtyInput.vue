<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    label="Quantity"
    v-model="qty"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    value: {},
    watch: {}
  },

  watch: {
    watch(val) {
      if (val) {
        setTimeout(() => {
          this.$el.querySelector('input').focus()
        }, 50)
      }
    }
  },

  computed: {
    qty: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('value', value)
      }
    }
  }
}
</script>