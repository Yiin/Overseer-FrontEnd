<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    label="Cost"
    :prefix="currency.symbol"
    v-model="cost"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    currency: {},
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
    cost: {
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