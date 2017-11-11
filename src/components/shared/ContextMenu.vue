<template lang='pug'>
  .context-menu(
    v-if='isOpen'
    ref='contextMenu'
    :style='position'
    v-clickaway='close'
    @contextmenu.prevent.stop=''
  )
      .context-menu-close(@click='close')

      //-
        Loop through list of context menu actions and render them based on
        action's type and properties
      context-menu-item(
        v-for='(item, index) in items'
        :key='index'
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

    position() {
      let { left, top } = this.state.position

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      // const largestHeight = window.innerHeight - this.$refs.contextMenu.offsetHeight - 25 + scrollTop
      // const largestWidth = window.innerWidth - this.$refs.contextMenu.offsetWidth - 25 + scrollLeft

      top += scrollTop
      left += scrollLeft

      return { top: top + 'px', left: left + 'px' }
    }
  },

  methods: {
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
    min-height: 35px;
    line-height: 24px;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
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