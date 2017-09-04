<template>
  <div class="date-picker">
    <input type="text" :name="name" @focus="open" @blur="close">

    <div v-if="isOpen" class="calendar-popup">
      <div class="calendar calendar--left">
        left
      </div>
      <div class="calendar--right">
        right
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name'],

  data() {
    return {
      isOpen: false
    }
  },

  methods: {
    open() {
      this.isOpen = true
    },

    close() {
      this.isOpen = false
    }
  }
}
</script>