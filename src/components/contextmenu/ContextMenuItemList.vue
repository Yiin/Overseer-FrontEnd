<template lang="pug">
  .context-menu__list-item(
    v-if='isVisible'
    :class='itemClasses'
    @mouseover.capture='calcListSize'
    @mouseout.capture='resetListSize'
  )
    //- Icon of the item
    context-menu-item-icon(
      v-if='item.props.icon'
      :icon='item.props.icon'
    )

    | {{ item.props.title }}

    .context-menu(
      ref='list'
      :style='listStyle'
    )
      .context-menu__list(
        :class='{ scrollable: listItems.length > 6 }'
      )
        component(
          v-for='(childItem, index) in listItems'
          :key='index'
          :is='childItem.component'
          :item='childItem'
        )
</template>

<script>
import ContextMenuItemMixin from './context-menu-item-mixin'

export default {
  mixins: [
    ContextMenuItemMixin
  ],

  data() {
    return {
      listDistToBottom: null,
      listDistToRight: null
    }
  },

  computed: {
    itemClasses() {
      return {
        list: true
      }
    },

    listItems() {
      return this.item.handle()
    },

    listStyle() {
      const style = {}

      if (this.listDistToBottom === null) {
        style.visibility = 'hidden'
      } else {
        style.visibility = 'visible'

        const minSpaceToBottom = 20
        const minSpaceToRight = 20

        const transform = []

        if (minSpaceToBottom > this.listDistToBottom) {
          const diff = this.listDistToBottom - minSpaceToBottom
          transform.push(`translateY(${diff}px)`)
        }
        if (minSpaceToRight > this.listDistToRight) {
          const diff = -this.$refs.list.clientWidth - this.$el.clientWidth
          transform.push(`translateX(${diff}px)`)
        }
        if (transform.length) {
          style.transform = transform.join(' ')
        }
      }
      return style
    }
  },

  methods: {
    calcListSize() {
      this.$ready(() => {
        const bcr = this.$refs.list.getBoundingClientRect()

        this.listDistToBottom = window.innerHeight - bcr.bottom
        this.listDistToRight = window.innerWidth - bcr.right
      })
    },

    resetListSize(e) {
      if (this.$refs.list.contains(e.toElement)) {
        return
      }
      this.listDistToBottom = null
      this.listDistToRight = null
    }
  }
}
</script>