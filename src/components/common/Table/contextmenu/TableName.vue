<template lang="pug">
  cm-item(
    v-bind='$attrs'
    v-on='$listeners'
    :item='item'
  )
    span {{ title }}
</template>

<script>
import { getDocumentTitle } from '@/modules/documents/helpers'
import ContextMenuItemMixin from '@/components/contextmenu/context-menu-item-mixin'

export default {
  mixins: [
    ContextMenuItemMixin
  ],

  computed: {
    scope() {
      return this.$store.state.contextmenu.scope
    },

    title() {
      return getDocumentTitle(this.scope, 'plural')
    }
  }
}
</script>