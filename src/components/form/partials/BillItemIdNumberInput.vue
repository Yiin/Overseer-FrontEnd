<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    label="ID Number"
    v-model="idNumber"
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
    idNumber: {
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