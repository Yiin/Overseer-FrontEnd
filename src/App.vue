<template lang="pug">
  v-app(
    :class='appClasses'
  )

    //-
      Default page

    template(v-if="isAuthenticated && !isRedirecting")

      //-
        if we're not locked

      div(v-show="!isLocked")

        //-
          main content

        .application__content(:style="applicationContentStyle")

          //-
            sidebar

          sidebar(v-show='!hideSidebar')


          //-
            page content

          .page-content
            transition(name='slow-cross-fade')
              router-view.router-view

        //-
          overlay content, absolute positioned

          content menu

        <context-menu></context-menu>


        //-
          background dim

        .background-dim(id='background-dim')


        //-
          taskbar items

        taskbar


        //-
          modal

        popup


        //-
          snack notification

        notification

      //-
        if we're locked, show lock screen

      transition(name='slow-cross-fade')
        lockscreen(v-show='isLocked')

    //-
      Auth screen

    auth(v-if='!isAuthenticated || !isLoaded')

    //-
      Move this somewhere else

    link(rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.8.0/css/flag-icon.min.css")

</template>

<script>
import Sidebar from '@/components/sidebar/Sidebar.vue'
import Taskbar from '@/components/taskbar/Taskbar.vue'
import Auth from '@/pages/auth/Auth.vue'
import Lockscreen from '@/pages/auth/Lockscreen.vue'
import Notification from '@/components/notification/Notification.vue'
import ContextMenu from '@/components/contextmenu/ContextMenu.vue'

export default {
  name: 'app',

  components: {
    Sidebar,
    Taskbar,
    Auth,
    Lockscreen,
    Notification,
    ContextMenu
  },

  data() {
    return {
      loaded: false,
      showingScalingNotification: false,
      shouldShowScalingNotification: true, // !localStorage.getItem('doNoShowScalingNotification'),
      disableScaling: false, // !!localStorage.getItem('disableScaling'),
      previousAspectRatio: null
    }
  },

  computed: {
    appClasses() {
      return {
        /**
         * If we're currently redirecting the user, change background color
         * from default to plain white, so it matches background color
         * which is set by browser in between the pages.
         */
        'app--transition-redirecting': this.isRedirecting,

        /**
         * If user was redirected, prepare for fade in effect
         */
        'app--transition': this.$store.state.auth.wasRedirected,

        /**
         * Data was loaded, fade in the content
         */
        'app--transition-active': this.loaded,

        /**
         * If user was authenticated, but not yet loaded, hide page overflow
         * until loading is finished.
         */
        '--hide-overflow': this.isAuthenticated && !this.isLoaded
      }
    },

    isAuthenticated() {
      return this.$store.state.auth.isLoggedIn
    },

    isLocked() {
      return this.$store.state.auth.isLocked
    },

    isRedirecting() {
      return this.$store.state.auth.isRedirecting
    },

    isLoaded() {
      return this.$store.state.auth.isLoaded
    },

    hideSidebar() {
      return this.$store.state.ui.sidebar.isHidden
    },

    applicationContentStyle() {
      return {
        transform: this.$store.state.scale.ratio ? `scale(${this.$store.state.scale.ratio})` : ''
      }
    },

    isOverlayActive() {
      return this.$store.state.ui.overlay.items.length > 0
    }
  },

  watch: {
    disableScaling(disable) {
      if (disable) {
        document.body.classList.add('--disable-scaling')
      } else {
        document.body.classList.remove('--disable-scaling')
      }
    },

    isLoaded() {
      this.updateOverflow()
    },

    isLocked() {
      this.updateOverflow()
    },

    isOverlayActive(isActive) {
      if (isActive) {
        document.documentElement.classList.add('--hide-overflow')
      } else {
        document.documentElement.classList.remove('--hide-overflow')
      }
    }
  },

  mounted() {
    /**
     * I don't even know wtf is this for anymore, but eh
     */
    setTimeout(() => {
      this.loaded = true
    })

    /**
     * Scaling listeners
     */
    window.addEventListener('resize', this.updateScale.bind(this))
    this.updateScale()

    if (/Mobi/.test(navigator.userAgent) || typeof window.orientation !== 'undefined') {
      console.log('disable scaling, cuz mobile')
      this.disableScaling = true
    }
    if (this.disableScaling) {
      document.body.classList.add('--disable-scaling')
    }

    /**
     * Hide overflow if user is not loaded yet (i.e. logged in)
     */
    this.updateOverflow()
  },

  methods: {
    updateOverflow() {
      if (!this.isLoaded || this.isLocked) {
        document.documentElement.classList.add('--hide-overflow')
      } else {
        document.documentElement.classList.remove('--hide-overflow')
      }
    },

    getCurrencyAspectRatio() {
      return {
        ratio: parseFloat((window.innerWidth / window.innerHeight).toFixed(3)),
        width: window.innerWidth,
        height: window.innerHeight
      }
    },

    updateScale(e) {
      if (this.disableScaling) {
        return
      }
      if (!this.previousAspectRatio) {
        this.previousAspectRatio = this.getCurrencyAspectRatio()
      }
      if (window.innerWidth <= 1900) {
        const w = window.innerWidth / 1900

        /**
         * Check if page was zoomed, not resized.
         *
         * It's sort of accurate-ish, we check if w/h ratio difference is minimal,
         * if both window width and height are changed and by how much.
         *
         * When zooming in, page is most likely to be zoomed in by 5-15% at once.
         *
         * p.s.
         * Remove this monstrosity once we get rid of scaling
         */
        if (e &&
          Math.abs(this.getCurrencyAspectRatio().ratio - this.previousAspectRatio.ratio) < 0.005 &&
          this.previousAspectRatio.width !== window.innerWidth &&
          this.previousAspectRatio.height !== window.innerHeight &&
          Math.min(this.previousAspectRatio.width, window.innerWidth) / Math.max(this.previousAspectRatio.width, window.innerWidth) < 0.95 &&
          Math.min(this.previousAspectRatio.height, window.innerHeight) / Math.max(this.previousAspectRatio.height, window.innerHeight) < 0.95
        ) {
          this.scalingNotificationResponse(false)
          return
        }
        this.previousAspectRatio = this.getCurrencyAspectRatio()

        this.$store.commit('UPDATE_SCALE', {
          ratio: w,
          offset: window.innerHeight * (1 - w) / 2
        })
      } else if (this.$store.state.scale.ratio < 1) {
        this.$store.commit('RESET_SCALE')
      }
    },

    showScalingNotificationIfNeeded() {
      if (
        // if we haven't shown the notification yet
        this.shouldShowScalingNotification
      ) {
        // show it now
        this.showingScalingNotification = true
      }
    },

    scalingNotificationResponse(keep) {
      if (keep) {
        // do nothing
      } else {
        // disable scaling
        this.disableScaling = true
        localStorage.setItem('disableScaling', true)
        this.$store.commit('RESET_SCALE')

        // and save reminder not to show notification in the future
        this.shouldShowScalingNotification = false
        localStorage.setItem('doNoShowScalingNotification', true)
      }
      this.showingScalingNotification = false
    }
  }
}
</script>

<style lang="stylus" src="@/styles/stylus/main.styl"></style>
<style lang="scss" src="@/styles/app.scss"></style>

<style lang="scss">
.card__text .highlight, .btn.highlight {
  font-weight: 700;
  &--main {
    color: $color-main;
  }
  &--red {
    color: $color-red;
  }
  &--title {
    font-size: 20px;
    font-weight: 500;
    color: $color-mine-shaft;
  }
}

.application__content {
  transform-origin: 50% 0%;
  min-height: 830px;
}

.application__overlay {
    height: 100%;
    width: 100%;
    position: absolute;
}

.background-dim {
  display: none;
}

#app {
  background: $color-wild-sand !important;
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