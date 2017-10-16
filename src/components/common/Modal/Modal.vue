<template>
  <div v-show="!isClosed" class="modal">
    <div class="background-dim" ref="dim" @mousedown.self="closeOrHide"></div>
    <div ref="modal" class="modal-background">
      <div class="modal__title">
        {{ $t(title) }}
      </div>
      <div class="modal__controls">
        <div class="modal-icon modal-icon__hide" @click="hide">
          <i class="modal-icon-hide"></i>
        </div>
        <div class="modal-icon modal-icon__full"></div>
        <div class="modal-icon modal-icon__close" @click="close">
          <i class="modal-icon-close"></i>
        </div>
      </div>
      <div class="modal__body">
        <component :is="component" :data="data.data" @cancel="close"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { TweenLite } from 'gsap'

export default {
  name: 'modal',

  data() {
    return {
      hasChanges: false,
      isClosed: true,
      isClosing: false,
      cachedData: {}
    }
  },

  computed: {
    isOpen() {
      return this.$store.state.modal.isOpen
    },

    data() {
      return this.isClosing ? this.cachedData : this.$store.state.modal.data
    },

    title() {
      return this.data.title
    },

    component() {
      return this.data.component
    }
  },

  watch: {
    isOpen(isOpen) {
      if (isOpen) {
        this.animateOpenFromTaskbar()
      } else {
        TweenLite.to(this.$refs.modal, 0.7, {
          y: this.$refs.modal.getBoundingClientRect().height
        }, 0)

        // fade in background dim
        TweenLite.to(this.$refs.dim, 0.7, {
          opacity: 0,
          onComplete: () => {
            this.isClosing = false
            this.isClosed = true
          }
        }, 0)
      }
    }
  },

  methods: {
    /**
     * Get element position in taskbar.
     */
    getTaskbarItemBoundingRect() {
      const index = this.$store.activeIndex

      return {
        width: 200,
        x: window.innerWidth - 50 + (180 * index),
        y: window.innerHeight - 44
      }
    },

    /**
     * Animate modal opening animation
     */
    animateOpenNew() {
      this.isClosed = false

      this.$nextTick(() => {
        // fade in background dim
        TweenLite.to(this.$refs.dim, 0.7, {
          opacity: 1
        }, 0)

        TweenLite.fromTo(this.$refs.modal, 0.7, {
          y: this.$refs.modal.getBoundingClientRect().height
        }, {
          y: 0
        }, 0)
      })
    },

    animateOpenFromTaskbar() {
      console.log(this.$refs.modal, this.$refs.modal.getBoundingClientRect())

      this.isClosed = false

      this.$nextTick(() => {
        const taskbarItemBoundingRect = this.getTaskbarItemBoundingRect()
        const modalBoundingRect = this.$refs.modal.getBoundingClientRect()

        // fade in background dim
        TweenLite.to(this.$refs.dim, 0.7, {
          opacity: 1
        }, 0)

        const ratio = taskbarItemBoundingRect.width / modalBoundingRect.width

        TweenLite.fromTo(this.$refs.modal, 7, {
          scale: ratio
          // x: taskbarItemBoundingRect.x - modalBoundingRect.x,
          // y: taskbarItemBoundingRect.y - modalBoundingRect.y
        }, {
          scale: 1,
          x: 0,
          y: 0
        }, 0)
      })
    },

    animateMoveToTaskbar() {
      //
    },

    animateCloseCompletely() {
      //
    },

    cacheData() {
      this.cachedData = Object.assign({}, this.data)
    },

    hide() {
      this.cacheData()
      this.isClosing = true
      this.$store.dispatch('HIDE_MODAL')
    },

    close() {
      this.cacheData()
      this.isClosing = true
      this.$store.dispatch('CLOSE_MODAL')
    },

    closeOrHide() {
      if (this.hasChanges) {
        this.hide()
      } else {
        // yeah just hide
        this.hide()
        // this.close()
      }
    }
  }
}
</script>

<style lang="scss" src="@/styles/modal.scss"></style>

<style lang="scss">
.move-enter {
  transform: translate(-50%, 600px) !important;
}

.move-enter-active {
  transition: all 0.6s;
}

.move-enter-to {
  transform: translate(-50%, 0) !important;
}

.move-leave {
  transform: translate(-50%, 0) !important;
}

.move-leave-active {
  transition: all 0.4s;
}

.move-leave-to {
  transform: translate(-50%, 600px) !important;
}
</style>