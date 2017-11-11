<template>
  <span>
    {{  }}
  </span>
</template>

<script>
import { getDocumentTitle } from '@/modules/documents/helpers'

export default {
  computed: {
    scope() {
      return this.$store.state.contextmenu.scope
    },

    title() {
      return getDocumentTitle(this.scope)
    }
  }
}
</script>