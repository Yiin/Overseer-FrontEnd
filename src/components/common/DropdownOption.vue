<template>
  <div v-show="isVisible" @click="select" class="dropdown__option">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'dropdown-option',

  props: {
    value: {
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isSelected: false,
      isVisible: true
    }
  },

  methods: {
    select() {
      this.$emit('select', this)
    }
  }
}
</script>