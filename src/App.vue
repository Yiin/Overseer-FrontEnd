<template>
  <div id="app" v-show="isLoaded">
    <template v-if="isLoggedIn">
      <navbar></navbar>
      <sidebar ></sidebar>
    </template>
    <div class="page-content">
      <router-view></router-view>
    </div>
    <taskbar></taskbar>
    <popup></popup>
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
    },

    isLoaded() {
      return true // this.$store.state.isLoaded
    }
  }
}
</script>

<style lang="scss" src="@/styles/app.scss"></style>

<style lang="scss">
.vue-drag-select {
  position: relative;
  user-select: none;
}

.vue-drag-select-box {
  position: absolute;
  background: rgba(132, 142, 210, 0.4);
  z-index: 99;
}

.disable-selection {
  user-select: none;
}
</style>