<template>
  <div class="row row--options">
    <dropdown :watch="currencies" @input="changeCurrency">
      <dropdown-option
        v-for="currency in currencies" :key="index"
        :value="currency.id"
      >
        {{ currency.code }}
      </dropdown-option>
    </dropdown>
  </div>
</template>

<script>
export default {
  computed: {
    selectedCurrency() {
      return this.currencies.find((currency) => this.$store.state.settings.currencyId === currency.id)
    },

    currencies() {
      return this.$store.state.passive.currencies
    }
  }
}
</script>