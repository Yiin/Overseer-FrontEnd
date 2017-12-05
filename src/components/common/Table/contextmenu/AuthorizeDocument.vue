<template lang="pug">
  v-list
    v-list-tile
      v-list-tile-title Assign user
    v-list-tile
      v-divider
</template>

<script>
import { getFormName } from '@/modules/documents/helpers'
import ContextMenuItemMixin from '@/components/contextmenu/context-menu-item-mixin'

export default {
  mixins: [
    ContextMenuItemMixin
  ],

  computed: {
    scope() {
      return this.$store.state.contextmenu.scope
    },

    documentType() {
      return getFormName(this.scope)
    },

    document() {
      return this.item.builder.getSelectedRow()
    }
  }
}
</script>