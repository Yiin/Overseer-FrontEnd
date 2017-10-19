<template>
  <div class="modal" :class="{ 'modal--visible': !isClosed }">
    <div class="background-dim" ref="dim" @mousedown.self="closeOrHide"></div>
    <div ref="modal" class="modal-container">
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
import { TweenLite, Power2 } from 'gsap'

export default {
  name: 'modal',

  data() {
    return {
      hasChanges: false,
      isClosed: true,
      isClosing: false,
      cachedData: {},
      cachedIndex: 0
    }
  },

  computed: {
    isOpen() {
      return this.$store.state.modal.isOpen
    },

    data() {
      return this.isClosing ? this.cachedData : this.$store.state.modal.data
    },

    taskbarItem() {
      if (this.$store.state.taskbar.activeIndex === null) {
        return this.$store.state.taskbar.items.find((item) => item.data === this.data) || null
      }
      return this.$store.state.taskbar.items[this.$store.state.taskbar.activeIndex]
    },

    taskbarIndex() {
      return this.$store.state.taskbar.activeIndex || this.cachedIndex
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
        if (this.taskbarItem && this.taskbarItem.isNew) {
          this.animateOpenNew()
        } else {
          this.animateOpenFromTaskbar()
        }
      } else {
        this.animateMoveToTaskbar()
      }
    }

    // '$store.state.taskbar.activeIndex': function (current, previous) {
    //   if (current !== null && previous !== null) {
    //     this.animateOpenNew()

    //     // setTimeout(this.animateOpenNew.bind(this), 500)
    //   }
    // }
  },

  methods: {
    /**
     * Get element position in taskbar.
     */
    getTaskbarItemBoundingRect() {
      const index = this.taskbarIndex

      return {
        width: 200,
        x: window.innerWidth - (230 + (180 * (index || 0))),
        y: window.innerHeight - 44
      }
    },

    animateBackgroundFadeIn() {
      // fade in background dim
      TweenLite.fromTo(this.$refs.dim, 0.3, {
        opacity: 0
      }, {
        opacity: 0.4,
        ease: Power2.easeIn
      }, 0)
    },

    animateBackgroundFadeOut() {
      // fade in background dim
      TweenLite.fromTo(this.$refs.dim, 0.3, {
        opacity: 0.4
      }, {
        opacity: 0,
        ease: Power2.easeIn
      }, 0)
    },

    /**
     * Animate modal opening animation
     */
    animateOpenNew() {
      this.isClosed = false

      this.$nextTick(() => {
        const taskbarItemBoundingRect = this.getTaskbarItemBoundingRect()
        const modalBoundingRect = this.$refs.modal.getBoundingClientRect()

        this.animateBackgroundFadeIn()

        const ratio = taskbarItemBoundingRect.width / modalBoundingRect.width

        const modalFinalPosition = {
          x: (window.innerWidth - modalBoundingRect.width) / 2,
          y: window.innerHeight - modalBoundingRect.height
        }

        const modalInitialPosition = {
          x: (window.innerWidth - modalBoundingRect.width) / 2,
          y: window.innerHeight
        }

        TweenLite.fromTo(this.$refs.modal, 0.4, {
          opacity: 0,
          scale: ratio,
          x: modalInitialPosition.x,
          y: modalInitialPosition.y
        }, {
          opacity: 1,
          scale: 1,
          x: modalFinalPosition.x,
          y: modalFinalPosition.y,
          ease: Power2.easeOut
        }, 0)
      })
    },

    animateOpenFromTaskbar() {
      this.isClosed = false

      this.$nextTick(() => {
        this.animateBackgroundFadeIn()

        const taskbarItemBoundingRect = this.getTaskbarItemBoundingRect()
        const modalBoundingRect = this.$refs.modal.getBoundingClientRect()

        const ratio = taskbarItemBoundingRect.width / modalBoundingRect.width

        const modalFinalPosition = {
          x: (window.innerWidth - modalBoundingRect.width) / 2,
          y: window.innerHeight - modalBoundingRect.height
        }

        const modalInitialPosition = {
          x: taskbarItemBoundingRect.x - (modalBoundingRect.width - modalBoundingRect.width * ratio) / 2,
          y: taskbarItemBoundingRect.y - (modalBoundingRect.height - modalBoundingRect.height * ratio) / 2
        }

        TweenLite.fromTo(this.$refs.modal, 0.4, {
          opacity: 1,
          scale: ratio,
          x: modalInitialPosition.x,
          y: modalInitialPosition.y,
          ease: Power2.easeOut
        }, {
          // opacity: 1,
          scale: 1,
          x: modalFinalPosition.x,
          y: modalFinalPosition.y
        }, 0)
      })
    },

    animateMoveToTaskbar() {
      const taskbarItemBoundingRect = this.getTaskbarItemBoundingRect()
      const modalBoundingRect = this.$refs.modal.getBoundingClientRect()

      const ratio = taskbarItemBoundingRect.width / modalBoundingRect.width

      const modalInitialPosition = {
        x: (window.innerWidth - modalBoundingRect.width) / 2,
        y: window.innerHeight - modalBoundingRect.height
      }

      const modalFinalPosition = {
        x: taskbarItemBoundingRect.x - (modalBoundingRect.width - modalBoundingRect.width * ratio) / 2,
        y: taskbarItemBoundingRect.y - (modalBoundingRect.height - modalBoundingRect.height * ratio) / 2
      }

      // fade out background dim
      this.animateBackgroundFadeOut()

      TweenLite.fromTo(this.$refs.modal, 0.4, {
        scale: 1,
        x: modalInitialPosition.x,
        y: modalInitialPosition.y
      }, {
        opacity: 0,
        scale: ratio,
        x: modalFinalPosition.x,
        y: modalFinalPosition.y,
        clearProps: 'all',
        onComplete: () => {
          this.isClosing = false
          this.isClosed = true
        }
      }, 0)
    },

    animateCloseCompletely() {
      this.animateBackgroundFadeOut()
    },

    cacheData() {
      this.cachedIndex = this.$store.state.taskbar.activeIndex
      this.cachedData = Object.assign({}, this.data)
    },

    hide() {
      this.cacheData()
      this.isClosing = true
      this.$store.dispatch('modal/HIDE')
    },

    close() {
      this.cacheData()
      this.isClosing = true
      this.$store.dispatch('modal/CLOSE')
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