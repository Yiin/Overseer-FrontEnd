export default {
  computed: {
    currencies() {
      return this.$store.state.passive.currencies.map((currency) => {
        return {
          text: currency.code,
          value: currency.code
        }
      })
    }
  }
}
