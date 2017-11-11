<template lang="pug">
  i18n(path='table.selected_rows')
    span.highlight {{ count }}
</template>

<script>
export default {
  computed: {
    scope() {
      return this.$store.state.contextmenu.scope
    },

    table() {
      return this.$store.state.table[this.scope]
    },

    count() {
      return this.table.selection.length
    }
  }
}
</script>