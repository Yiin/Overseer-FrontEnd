<template>
  <div id="app" :class="{ transitioning: isTransitioning }">
    <template v-if="isAuthenticated">
      <navbar></navbar>
      <sidebar></sidebar>
      <div class="page-content">
        <transition name="fade">
          <router-view class="router-view"></router-view>
        </transition>
      </div>
      <taskbar></taskbar>
      <popup></popup>
    </template>
    <template v-if="!isAuthenticated || isTransitioning">
      <login @start-transition="startTransition" @end-transition="endTransition"></login>
    </template>
  </div>
</template>

<script>
import NavBar from '@/components/navbar/Navbar.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import Taskbar from '@/components/taskbar/Taskbar.vue'
import Login from '@/components/login/Login.vue'

export default {
  name: 'app',

  components: {
    'navbar': NavBar,
    'sidebar': Sidebar,
    'taskbar': Taskbar,
    'login': Login
  },

  data() {
    return {
      isTransitioning: false
    }
  },

  computed: {
    isAuthenticated() {
      return this.$store.state.auth.isLoggedIn
    }
  },

  methods: {
    startTransition() {
      this.isTransitioning = true
    },

    endTransition() {
      this.isTransitioning = false
    }
  }
}
</script>

<style lang="scss" src="@/styles/app.scss"></style>

<style>
.transitioning {
  overflow: hidden;
}

.router-view {
    position: absolute;
    width: calc(100% - 76px);
    padding-bottom: 90px;
}
</style>

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