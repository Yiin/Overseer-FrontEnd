<template>
  <div class="modal-tab" v-if="isActive">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'modal-tab',

  props: {
    title: {
      required: true
    }
  },

  data() {
    return {
      isActive: false
    }
  }
}
</script>