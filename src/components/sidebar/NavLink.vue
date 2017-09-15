<template>
  <router-link
    :to="{ name }"
    class="sidebar__nav-link --do-not-style-link"
    active-class="sidebar__nav-link--active"
  >
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: ['name']
}
</script>