<template>
  <router-link
    :to="{ name }"
    @mousedown.native="onMouseDown"
    class="sidebar__nav-link --do-not-style-link"
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
        this.$store.dispatch('LOAD_TABLE', {name: this.name})
      }
    }
  }
}
</script>