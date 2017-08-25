<template>
  <div id="app">
    <template v-if="isLoggedIn">
      <navbar></navbar>
      <sidebar ></sidebar>
    </template>
    <div class="page-content">
      <router-view></router-view>
    </div>
    <taskbar></taskbar>
  </div>
</template>

<script>
import NavBar from '@/components/navbar/Navbar.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import Taskbar from '@/components/taskbar/Taskbar.vue'

export default {
  name: 'app',

  components: {
    'navbar': NavBar,
    'sidebar': Sidebar,
    'taskbar': Taskbar
  },

  computed: {
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn
    }
  }
}
</script>

<style lang="scss" src="@/styles/app.scss"></style>