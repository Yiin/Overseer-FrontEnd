<template>
  <router-link
    tag="div"
    :to="{ name }"
    @mousedown.native="onMouseDown"
    class="sidebar__nav-link"
    active-class="sidebar__nav-link--active"
  >
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: ['name', 'preload'],

  methods: {
    onMouseDown() {
      if (this.preload) {
        this.$store.dispatch('preloadData', {name: this.name})
      }
    }
  }
}
</script>