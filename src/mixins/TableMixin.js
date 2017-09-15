export default {
  computed: {
    state() {
      return this.$store.state.table[this.name]
    },

    list() {
      return {
        name,
        pageList: this.$store.getters[`table/${this.name}/pageItems`],
        selection: this.state.selection
      }
    },

    pagination() {
      return {
        page: this.state.page,
        pages: this.$store.getters[`table/${this.name}/pagesCount`],
        amount: this.state.rows_per_page,
        total: this.state.items.length
      }
    }
  }
}
