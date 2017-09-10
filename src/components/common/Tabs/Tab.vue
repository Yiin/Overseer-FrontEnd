<template>
  <div v-show="isActive" class="tab">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tab',

  props: {
    active: {
      default: false
    },
    title: {
      required: true
    }
  },

  data() {
    return {
      isActive: !!this.active
    }
  }
}
</script>