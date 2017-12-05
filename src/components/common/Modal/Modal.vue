<template>
  <div class="modal" :class="{ 'modal--visible': !isClosed }" @click.self="closeOrHide">
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
      isHiding: false,
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
    },

    ratio() {
      return this.$store.state.scale.ratio || 1
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
        if (this.isHiding) {
          this.animateMoveToTaskbar()
        } else {
          this.animateCloseCompletely()
        }
      }
    },

    '$store.state.taskbar.activeIndex': function (current, previous) {
      if (current !== null && previous !== null) {
        if (this.taskbarItem.parent) {
          this.animateMoveToTaskbar()
          setTimeout(this.animateOpenNew.bind(this), 500)
        } else {
          this.animateCloseCompletely()
          setTimeout(this.animateOpenFromTaskbar.bind(this), 500)
        }
      }
    }
  },

  mounted() {
    window.addEventListener('resize', this.animateUpdatePosition)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.animateUpdatePosition)
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

    getModalBoundingRect() {
      const parentRect = this.$el.getBoundingClientRect()
      const modalRect = this.$refs.modal.getBoundingClientRect()
      const r = this.ratio

      const rect = {
        width: modalRect.width / r,
        height: modalRect.height / r
      }

      // const wd = rect.width - modalRect.width
      // const hd = rect.height - modalRect.height

      rect.x = modalRect.x - parentRect.x
      rect.y = modalRect.y - parentRect.y
      rect.left = rect.x
      rect.right = window.innerWidth - (rect.x + rect.width)
      rect.bottom = window.innerHeight - (rect.y + rect.height)
      rect.top = rect.y

      return rect
    },

    animateBackgroundFadeIn() {
      // fade in background dim
      TweenLite.fromTo(document.getElementById('background-dim'), 0.3, {
        opacity: 0,
        display: 'block'
      }, {
        opacity: 0.4,
        ease: Power2.easeOut
      }, 0)
    },

    animateBackgroundFadeOut() {
      // fade in background dim
      TweenLite.fromTo(document.getElementById('background-dim'), 0.3, {
        opacity: 0.4
      }, {
        opacity: 0,
        ease: Power2.easeOut,
        clearProps: 'all'
      }, 0)
    },

    /**
     * Animate modal opening animation
     */
    animateOpenNew() {
      this.isClosing = false
      this.isHiding = false
      this.isClosed = false

      this.$nextTick(() => {
        const modalBoundingRect = this.getModalBoundingRect()

        const modalFinalPosition = {
          x: Math.round((window.innerWidth - modalBoundingRect.width) / 2),
          y: Math.round(window.innerHeight - modalBoundingRect.height)
        }

        const modalInitialPosition = {
          x: Math.round((window.innerWidth - modalBoundingRect.width) / 2),
          y: Math.round(window.innerHeight)
        }

        this.$nextTick(() => {
          TweenLite.fromTo(this.$refs.modal, 0.3, {
            opacity: 0,
            x: modalInitialPosition.x,
            y: modalInitialPosition.y
          }, {
            opacity: 1,
            scale: 1,
            x: modalFinalPosition.x,
            y: modalFinalPosition.y,
            ease: Power2.easeOut
          })

          this.animateBackgroundFadeIn()
        })
      })
    },

    animateUpdatePosition() {
      const modalBoundingRect = this.getModalBoundingRect()

      const modalFinalPosition = {
        x: Math.round((window.innerWidth - modalBoundingRect.width) / 2),
        y: Math.round(window.innerHeight - modalBoundingRect.height)
      }

      TweenLite.to(this.$refs.modal, 0.1, modalFinalPosition)
    },

    animateOpenFromTaskbar() {
      this.isClosing = false
      this.isHiding = false
      this.isClosed = false

      this.$nextTick(() => {
        const taskbarItemBoundingRect = this.getTaskbarItemBoundingRect()
        const modalBoundingRect = this.getModalBoundingRect()

        const ratio = taskbarItemBoundingRect.width / modalBoundingRect.width

        const modalFinalPosition = {
          x: Math.round((window.innerWidth - modalBoundingRect.width) / 2),
          y: Math.round(window.innerHeight - modalBoundingRect.height)
        }

        const modalInitialPosition = {
          x: Math.round(taskbarItemBoundingRect.x - (modalBoundingRect.width - modalBoundingRect.width * ratio) / 2),
          y: Math.round(taskbarItemBoundingRect.y - (modalBoundingRect.height - modalBoundingRect.height * ratio) / 2)
        }

        this.$nextTick(() => {
          TweenLite.fromTo(this.$refs.modal, 0.3, {
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
          })

          this.animateBackgroundFadeIn()
        })
      })
    },

    animateMoveToTaskbar() {
      const taskbarItemBoundingRect = this.getTaskbarItemBoundingRect()
      const modalBoundingRect = this.getModalBoundingRect()

      const ratio = taskbarItemBoundingRect.width / modalBoundingRect.width

      const modalInitialPosition = {
        x: Math.round((window.innerWidth - modalBoundingRect.width) / 2),
        y: Math.round(window.innerHeight - modalBoundingRect.height)
      }

      const modalFinalPosition = {
        x: Math.round(taskbarItemBoundingRect.x - (modalBoundingRect.width - modalBoundingRect.width * ratio) / 2),
        y: Math.round(taskbarItemBoundingRect.y - (modalBoundingRect.height - modalBoundingRect.height * ratio) / 2)
      }

      this.$nextTick(() => {
        TweenLite.fromTo(this.$refs.modal, 0.3, {
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
            this.isHiding = false
            this.isClosed = true
          }
        })

        // fade out background dim
        this.animateBackgroundFadeOut()
      })
    },

    animateCloseCompletely() {
      this.$nextTick(() => {
        TweenLite.to(this.$refs.modal, 0.2, {
          opacity: 0,
          clearProps: 'all',
          onComplete: () => {
            this.isClosing = false
            this.isHiding = false
            this.isClosed = true
          }
        })

        this.animateBackgroundFadeOut()
      })
    },

    cacheData() {
      this.cachedIndex = this.$store.state.taskbar.activeIndex
      this.cachedData = Object.assign({}, this.data)
    },

    hide() {
      this.cacheData()
      this.isClosing = true
      this.isHiding = true
      this.$store.dispatch('modal/HIDE')
    },

    close() {
      this.cacheData()
      this.isClosing = true
      this.$store.dispatch('modal/CLOSE')
    },

    closeOrHide() {
      if (!this.isOpen) {
        // ignore
        return
      }
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