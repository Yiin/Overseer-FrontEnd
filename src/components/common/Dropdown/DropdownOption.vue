<template>
  <div v-show="isVisible" @click="select" class="dropdown__option" v-tooltip="tooltip">
    <div class="dropdown-option__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import he from 'he'

export default {
  name: 'dropdown-option',

  props: {
    value: {
      type: [String, Number, Boolean, Object]
    },
    selected: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Object,
      default: undefined
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

  mounted() {
    if (this.selected) {
      this.select()
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