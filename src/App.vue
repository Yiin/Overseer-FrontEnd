<template>
  <v-app
    :class="{
      'app--transition': $store.state.auth.wasRedirected,
      'app--transition-active': loaded,
      'app--transition-redirecting': isRedirecting,
      'transitioning': isAuthenticated && !isLoaded
    }">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.8.0/css/flag-icon.min.css">
    <template v-if="isAuthenticated && !isRedirecting">
      <sidebar></sidebar>
      <div class="page-content">
        <transition name="slow-cross-fade">
          <router-view class="router-view"></router-view>
        </transition>
      </div>
      <taskbar></taskbar>
      <popup></popup>
      <notification></notification>
    </template>
    <auth v-if="!isAuthenticated || !isLoaded"></auth>
  </v-app>
</template>

<script>
import Sidebar from '@/components/sidebar/Sidebar.vue'
import Taskbar from '@/components/taskbar/Taskbar.vue'
import Auth from '@/pages/auth/Auth.vue'
import Notification from '@/components/notification/Notification.vue'
import {
  VApp
} from 'vuetify'

export default {
  name: 'app',

  components: {
    Sidebar,
    Taskbar,
    Auth,
    VApp,
    Notification
  },

  data() {
    return {
      scale: 1,
      loaded: false
    }
  },

  computed: {
    isAuthenticated() {
      return this.$store.state.auth.isLoggedIn
    },

    isRedirecting() {
      return this.$store.state.auth.isRedirecting
    },

    isLoaded() {
      return this.$store.state.auth.isLoaded
    }
  },

  mounted() {
    setTimeout(() => {
      this.loaded = true
    })
    // window.addEventListener('resize', this.updateScale.bind(this))
    // this.updateScale()
  },

  methods: {
    updateScale() {
      if (window.innerWidth <= 1500) {
        const w = window.innerWidth / 1500
        this.scale = w
      }
    }
  }
}
</script>

<style lang="stylus" src="@/styles/stylus/main.styl"></style>
<style lang="scss" src="@/styles/app.scss"></style>

<style lang="scss">
.transitioning {
  overflow: hidden;
}

.router-view {
    position: absolute;
    width: calc(100% - 76px);
    padding-bottom: 65px;
}

#app {
  background: #f5f5f5 !important;
  &.app--transition {
    filter: opacity(0);
    transition: all 0.5s;
    &-active {
      filter: opacity(1) !important;
    }
  }
  &.app--transition-redirecting {
    transition: all 0.5s;
    background: #ffffff !important;
  }
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