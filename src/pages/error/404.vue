<template>
  <div class="placeholder-area placeholder-area--full-screen">
    <div class="placeholder placeholder--404"></div>
    <div @click="goHome" class="button button--create">
      Home
    </div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  beforeDestroy() {
    this.$store.commit('HIDE_SIDEBAR', false)
  },

  methods: {
    goHome() {
      router.push({
        name: 'overview'
      })
    }
  }
}
</script>