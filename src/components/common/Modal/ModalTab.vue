<template>
  <div class="modal-tab" v-if="isActive">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'modal-tab',

  inject: ['addTabItem', 'removeTabItem'],

  props: {
    title: {
      required: true
    }
  },

  data() {
    return {
      isActive: false
    }
  },

  mounted() {
    this.addTabItem(this.title, this.setActive)
  },

  beforeDestroy() {
    this.removeTabItem(this.title)
  },

  methods: {
    setActive(isActive) {
      this.isActive = isActive
    }
  }
}
</script>