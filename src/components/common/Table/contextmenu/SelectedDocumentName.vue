<template lang="pug">
  i18n(path='table.selected_document')
    span {{ $t('common.' + documentType) }}
    span.highlight {{ table.selectedRow.getTitle() }}
</template>

<script>
import { getFormName } from '@/modules/documents/helpers'

export default {
  computed: {
    scope() {
      return this.$store.state.contextmenu.scope
    },

    table() {
      return this.$store.state.table[this.scope]
    },

    documentType() {
      return getFormName(this.scope)
    }
  }
}
</script>