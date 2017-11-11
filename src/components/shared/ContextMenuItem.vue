<template lang="pug">
  .context-menu__list-item(
    v-if='isVisible'
    :class='itemClasses'
    @click='select'
  )
    //- Icon of the item
    context-menu-item-icon(
      v-if='item.icon'
      :icon='item.icon'
    )

    //- Custom item component
    component(
      v-if='item.custom'
      :is='item.component'
      :item='item'
    )

    //- Displays item title, if it has one
    template(v-else-if='item.title') {{ $t(item.title) }}

    .context-menu(
      v-if='item.isList'
    )
      .context-menu__list(
        :class='{ scrollable: listItems.length > 6 }'
      )
        context-menu-item(
          v-for='(childItem, index) in listItems'
          :key='index'
          :item='childItem'
        )
</template>

<script>
import ContextMenuItemIcon from './ContextMenuItemIcon.vue'

export default {
  name: 'context-menu-item',

  components: {
    ContextMenuItemIcon
  },

  props: {
    item: {
      required: true
    }
  },

  computed: {
    scope() {
      return this.$store.state.contextmenu.scope
    },

    isVisible() {
      return typeof this.item.visible === 'function'
          ? this.item.visible(this.scope)
          : true
    },

    itemClasses() {
      return [
        {
          list: this.item.isList,
          separator: this.item.isSeparator,
          static: this.item.isStatic
        }, this.item.class
      ]
    },

    listItems() {
      return this.item.makeList(this.scope)
    }
  },

  methods: {
    select() {
      if ('handler' in this.item) {
        this.item.handler(this.scope)
      }
      if (!('closeOnSelect' in this.item) || this.item.closeOnSelect) {
        this.$store.dispatch('contextmenu/CLOSE')
      }
    }
  }
}
</script>