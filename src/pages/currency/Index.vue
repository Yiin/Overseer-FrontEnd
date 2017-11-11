<template>
  <div>
    <div class="table">
      <div class="table__head">
        <div class="column" style="width: 10%"></div>
        <div class="column" style="width: 55%">
          <span>Currency</span>
        </div>
        <div class="column" style="width: 35%">
          <span>Rate (EUR)</span>
        </div>
      </div>
      <div class="table__body">
        <div v-for="currency in currencies" class="table__row">
          <div class="column" style="width: 10%">
            <span>
              <img :src="`http://www.xe.com/themes/xe/images/flags/svg/${currency.code.toLowerCase()}.svg`" alt="" width="45px">
            </span>
          </div>
          <div class="column" style="width: 15%">
            <span>{{ currency.code }}</span>
          </div>
          <div class="column" style="width: 40%">
            <span>{{ currency.name }}</span>
          </div>
          <div class="column" style="width: 35%">
            <span>{{ currency.rates[base] || 1 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currencies() {
      return this.$store.getters['documents/repositories/currency/AVAILABLE_ITEMS']
    },

    base() {
      return this.$store.state.settings.currency.code
    }
  }
}
</script>