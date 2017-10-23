<template>
  <md-input-container :class="{ 'md-input-invalid': errorMessages.length }">
    <label>{{ label }}</label>
    <md-input :tabindex="tabindex" v-bind="$attrs" v-on="$listeners" v-model="fieldValue"></md-input>

    <span v-for="error in errorMessages" class="md-error">
      {{ error }}
    </span>
  </md-input-container>
</template>

<script>
export default {
  props: {
    errorMessages: {
      default: () => []
    },
    label: {
      default: ''
    },
    tabindex: {
      default: undefined
    },
    value: {}
  },

  computed: {
    fieldValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>