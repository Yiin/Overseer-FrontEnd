<template lang="pug">
  .context-menu__list-item(
    v-if='isVisible'
    :class='itemClasses'
  )
    i18n(path='table.selected_document')
      span {{ $t('common.' + documentType) }}
      span.highlight(
        :title='documentTitle'
      ) {{ documentTitle }}
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

    documentTitle() {
      return this.item.builder.getSelectedRow().getTitle()
    }
  }
}
</script>