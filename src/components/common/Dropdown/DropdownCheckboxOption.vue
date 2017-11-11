<template>
  <div v-show="isVisible" @click="check" class="dropdown__option dropdown__option--checkbox">
    <input @click.prevent class="checkbox" type="checkbox" v-model="isChecked">
    <div class="option-label">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import he from 'he'

export default {
  name: 'dropdown-checkbox-option',

  props: {
    value: {
      required: true
    },
    checked: {
      default: false
    }
  },

  data() {
    return {
      isVisible: true,
      isChecked: this.checked
    }
  },

  watch: {
    checked(checked) {
      this.isChecked = checked
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