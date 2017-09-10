<template>
  <div v-show="isVisible" @click="select" class="dropdown__option">
    <slot></slot>
  </div>
</template>

<script>
import he from 'he'

export default {
  name: 'dropdown-option',

  props: {
    value: [String, Number, Boolean],
    selected: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isVisible: true
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
    select() {
      this.$emit('select', {
        value: this.value,
        text: this.text
      })
    }
  }
}
</script>