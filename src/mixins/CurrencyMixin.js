export default {
  computed: {
    currencies() {
      return this.$store.getters['documents/repositories/currency/AVAILABLE_ITEMS'].map((currency) => {
        return {
          text: currency.code,
          value: currency.code
        }
      })
    }
  }
}
