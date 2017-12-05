<template lang="pug">
  .context-menu__list-item(
    v-if='isVisible'
    :class='itemClasses'
  )
    i18n(path='table.selected_rows')
      span.highlight {{ count }}
</template>

<script>
import ContextMenuItemMixin from '@/components/contextmenu/context-menu-item-mixin'

export default {
  mixins: [
    ContextMenuItemMixin
  ],

  computed: {
    count() {
      return this.item.builder.getSelection().length
    }
  }
}
</script>