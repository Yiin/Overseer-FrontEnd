<template>
  <div>
    <div class="table">
      <div class="table__head">
        <div class="column" style="width: 65%">
          <span>Currency</span>
        </div>
        <div class="column" style="width: 35%">
          <span>Rate (EUR)</span>
        </div>
      </div>
      <div class="table__body">
        <div v-for="currency in currencies" class="table__row">
          <div class="column" style="width: 15%">
            <span>
              <span class="flag-icon" :class="['flag-icon-' + currency.iso_3166_2.toLowerCase()]"></span>
              {{ currency.code }}
            </span>
          </div>
          <div class="column" style="width: 50%">
            <span>{{ currency.name }}</span>
          </div>
          <div class="column" style="width: 35%">
            <span>{{ currency.eur_rate }}</span>
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
      return this.$store.state.passive.currencies
    }
  }
}
</script>