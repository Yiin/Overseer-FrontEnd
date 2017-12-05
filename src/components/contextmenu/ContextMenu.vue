<template lang='pug'>
  .context-menu(
    v-if='isOpen'
    ref='contextMenu'
    :style='menuStyle'
    v-clickaway='close'
    @contextmenu.prevent.stop=''
  )
    .context-menu-close(@click='close')

    //-
      Loop through list of context menu actions and render them based on
      action's type and properties
    component(
      v-for='(item, index) in items'
      :key='index'
      :is='item.component'
      :item='item'
    )
  </div>
</template>

<script>
import ContextMenuItem from './ContextMenuItem.vue'

export default {
  components: {
    ContextMenuItem
  },

  data() {
    return {
      menuDistToBottom: null,
      menuDistToRight: null
    }
  },

  computed: {
    state() {
      return this.$store.state.contextmenu
    },

    scope() {
      return this.state.scope
    },

    items() {
      return this.state.items
    },

    isOpen() {
      return this.state.isOpen
    },

    menuStyle() {
      const style = {}

      let { left, top } = this.state.position

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      top += scrollTop
      left += scrollLeft

      if (!this.menuDistToBottom) {
        style.visibility = 'hidden'
      } else {
        const minSpaceToBottom = 20
        const minSpaceToRight = 20

        if (minSpaceToBottom > this.menuDistToBottom) {
          const diff = this.menuDistToBottom - minSpaceToBottom

          top += diff
        }
        if (minSpaceToRight > this.menuDistToRight) {
          const diff = this.menuDistToRight - minSpaceToRight

          left += diff
        }
      }

      style.top = top + 'px'
      style.left = left + 'px'

      return style
    }
  },

  watch: {
    isOpen(isOpen) {
      if (isOpen) {
        this.calcMenuSize()
      } else {
        this.resetMenuSize()
      }
    }
  },

  methods: {
    calcMenuSize() {
      this.$ready(() => {
        const bcr = this.$refs.contextMenu.getBoundingClientRect()

        this.menuDistToBottom = window.innerHeight - bcr.bottom
        this.menuDistToRight = window.innerWidth - bcr.right
      })
    },

    resetMenuSize() {
      this.menuDistToBottom = null
    },

    close() {
      this.$store.dispatch('contextmenu/CLOSE')
    }
  }
}
</script>

<style lang="scss">
.context-menu {
  background: $color-white;
  box-shadow: $box-shadow-context-menu;
  position: absolute;
  width: 320px;
  z-index: 10;
  padding: 6px 0 17px;
  border-radius: 3px;
  cursor: default;
}

.context-menu__list-item {
  font-size: 16px;
  cursor: default;
  user-select: none;
  padding: 0 30px 0 26px;
  color: $color-main-dark;
  display: flex;
  align-items: center;
  position: relative;

  &:not(.static) {
    min-height: 36px;
    cursor: pointer;
    &:hover {
      background-color: $color-wild-sand;
    }
  }

  &.heading {
    height: 37px;
    line-height: 37px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;
  }

  &.separator {
    padding: 0;
    border-top: 1px solid #e0e0e0;
    width: 100%;
    margin: 5px auto;
  }

  &.list {
      /**
       * Small triangle arrow indicating that this option is
       * a dropdown
       */
      &::after
      {
          position: absolute;
          top: 13px;
          right: 15px;

          content: '';

          color: $color-mine-shaft;
          border-width: 4px 0 4px 4px;
          border-style: solid;
          border-color: transparent transparent transparent $color-mine-shaft;
      }
  }

  .context-menu {
    display: none;
    position: absolute;
    left: 320px;
    top: -6px;

    &__list {
      margin-right: 6px;
      max-height: 400px;
      overflow: auto;
    }
  }

  &:hover .context-menu {
    display: block;
  }

  i {
    margin-right: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    font-size: 24px;
    width: 16px;
    color: rgba(0,0,0,0.54);
  }

  .highlight {
    color: $color-main;
    font-weight: $font-weight-semibold;
  }
}

.context-menu-close {
  position: absolute;
  padding: 15px;
  top: 6px;
  right: 6px;
  cursor: pointer;
  z-index: 1;
}

.context-menu-close:hover {
  opacity: 0.8;
}

.context-menu-close::before {
  content: "";
  position: absolute;
  background: url(../../assets/icons/cross.svg) no-repeat;
  background-size: contain;
  width: 12px;
  height: 12px;
  top: 9px;
  right: 9px;
}
</style>