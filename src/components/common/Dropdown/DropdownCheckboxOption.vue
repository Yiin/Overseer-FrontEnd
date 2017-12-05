<template lang="pug">
  .dropdown__option.dropdown__option--checkbox(
    v-show="isVisible"
    @click="check"
  )
    x-checkbox(v-model="isChecked")
    .option-label
      slot

</template>

<script>
import he from 'he'

export default {
  name: 'dropdown-checkbox-option',

  props: {
    value: {},
    manual: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isVisible: true,
      isChecked: !!this.checked
    }
  },

  watch: {
    checked(checked) {
      this.isChecked = !!checked
    }
  },

  computed: {
    text() {
      return he.decode(this.$slots.default[0].text).trim()
    },

    searchable() {
      return this.text.toLowerCase()
    }
  },

  methods: {
    check() {
      if (this.manual) {
        return
      }

      this.isChecked = !this.isChecked
      this.$emit('toggle', {
        value: this.value,
        isChecked: this.isChecked
      })
    },

    uncheck() {
      if (this.isChecked) {
        this.check()
      }
    }
  }
}
</script>