<template>
  <div>
    <div class="row row--options">
      <dropdown searchable scrollable class="dropdown--dashboard-options"
        :watch="currencies"
        @input="changeCurrency"
      >
        <dropdown-option
          v-for="currency in currencies" :key="currency.id"
          :value="currency.id"
          :selected="currency.id === selectedCurrency.id"
        >
          {{ currency.code }}
        </dropdown-option>
      </dropdown>

      <dropdown class="dropdown--dashboard-options"
        @input="changeGraphInterval"
      >
        <dropdown-option
          v-for="interval in graphIntervals" :key="interval.key"
          :value="interval.key"
          :selected="interval.key === selectedGraphInterval.key"
        >
          {{ interval.name }}
        </dropdown-option>
      </dropdown>

      <range-date-picker
        class="dropdown--dashboard-options dropdown--datepicker"
        v-model="statisticsDateRange"
        @input="changeDateRange"
        @selected-key="updateDateRangeKey"
        :range="statisticsDateRangeKey"
      ></range-date-picker>
    </div>
    <div class="row">
      <div class="block block--dashboard">
        <div class="block__title">
          Total Revenue
        </div>
        <div class="block__body block__body--dashboard-statistics">
          <div class="value value__dashboard value__dashboard--total">
            {{ selectedCurrency.symbol }}
            {{ totalRevenue }}
          </div>
          <div class="time-frame-total">
            <div class="value value__dashboard value__dashboard--time-framed">
              {{ selectedCurrency.symbol }}
              {{ totalRevenueInDateRange }}
            </div>
            <div class="time-frame">
              {{ $t('datetime.' + (statisticsDateRangeKey || 'custom_range')) }}
            </div>
          </div>
        </div>
      </div>
      <div class="block block--dashboard">
        <div class="block__title">
          Total Expenses
        </div>
        <div class="block__body block__body--dashboard-statistics">
          <div class="value value__dashboard value__dashboard--total">
            {{ selectedCurrency.symbol }}
            {{ totalExpenses }}
          </div>
          <div class="time-frame-total">
            <div class="value value__dashboard value__dashboard--time-framed">
              {{ selectedCurrency.symbol }}
              {{ totalExpensesInDateRange }}
            </div>
            <div class="time-frame">
              {{ $t('datetime.' + (statisticsDateRangeKey || 'custom_range')) }}
            </div>
          </div>
        </div>
      </div>
      <div class="block block--dashboard">
        <div class="block__title">
          Total Outstanding
        </div>
        <div class="block__body block__body--dashboard-statistics">
          <div class="value value__dashboard value__dashboard--total">
            {{ selectedCurrency.symbol }}
            {{ totalOutstanding }}
          </div>
          <div class="time-frame-total">
            <div class="value value__dashboard value__dashboard--time-framed">
              {{ selectedCurrency.symbol }}
              {{ totalOutstandingInDateRange }}
            </div>
            <div class="time-frame">
              {{ $t('datetime.' + (statisticsDateRangeKey || 'custom_range')) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import RangeDatePicker from '@/components/common/DatePicker/RangeDatePicker.vue'
import Statuses from '@/modules/documents/statuses'

export default {
  components: {
    RangeDatePicker
  },

  computed: {
    selectedCurrency() {
      return this.$store.state.dashboard.currency
    },

    currencies() {
      let currencies = [this.selectedCurrency]
        .concat(this.$store.getters['table/products/activeItems'].map((product) => product.currency))
        .concat(this.$store.getters['table/invoices/activeItems'].map((invoice) => invoice.currency))
        .concat(this.$store.getters['table/payments/activeItems'].map((payment) => payment.currency))
        .concat(this.$store.getters['table/credits/activeItems'].map((credit) => credit.currency))
        .concat(this.$store.getters['table/quotes/activeItems'].map((quote) => quote.currency))
        .concat(this.$store.getters['table/expenses/activeItems'].map((expense) => expense.currency))
        .filter((currency) => !!currency)

      return _.uniqBy(currencies, 'id')
    },

    graphIntervals() {
      return [
        { key: 'day', name: this.$t('common.day') },
        { key: 'week', name: this.$t('common.week') },
        { key: 'month', name: this.$t('common.month') }
      ]
    },

    selectedGraphInterval() {
      return this.graphIntervals.find((interval) => {
        return this.$store.state.dashboard.statisticsGraphInterval === interval.key
      })
    },

    statisticsDateRange: {
      get() {
        return this.$store.state.dashboard.statisticsDateRange
      },
      set() {}
    },

    statisticsDateRangeKey() {
      return this.$store.state.dashboard.statisticsDateRangeKey
    },

    totalRevenue() {
      return this.payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount)
      }, 0)
    },

    totalRevenueInDateRange() {
      if (!this.statisticsDateRange) {
        return
      }
      return this.payments.filter((payment) => {
        return moment(payment.payment_date).isBetween(
          this.statisticsDateRange.start,
          this.statisticsDateRange.end
        )
      }).reduce((sum, payment) => {
        return sum + parseFloat(payment.amount)
      }, 0)
    },

    totalExpenses() {
      return this.expenses.reduce((sum, expense) => {
        return sum + parseFloat(expense.amount)
      }, 0)
    },

    totalExpensesInDateRange() {
      if (!this.statisticsDateRange) {
        return
      }
      return this.expenses.filter((expense) => {
        return moment(expense.expense_date).isBetween(
          this.statisticsDateRange.start,
          this.statisticsDateRange.end
        )
      }).reduce((sum, expense) => {
        return sum + parseFloat(expense.amount)
      }, 0)
    },

    totalOutstanding() {
      return this.invoices.reduce((sum, invoice) => {
        return sum + Math.max(0, parseFloat(invoice.amount) - parseFloat(invoice.paid_in))
      }, 0)
    },

    totalOutstandingInDateRange() {
      if (!this.statisticsDateRange) {
        return
      }
      return this.invoices.filter((invoice) => {
        return moment(invoice.invoice_date).isBetween(
          this.statisticsDateRange.start,
          this.statisticsDateRange.end
        )
      }).reduce((sum, invoice) => {
        return sum + Math.max(0, parseFloat(invoice.amount) - parseFloat(invoice.paid_in))
      }, 0)
    },

    payments() {
      return this.$store.state.table.payments.items.filter((payment) => {
        return Statuses.generic.active.meetsCondition(payment)
      })
    },

    expenses() {
      return this.$store.state.table.expenses.items.filter((expense) => {
        return Statuses.generic.active.meetsCondition(expense)
      })
    },

    invoices() {
      return this.$store.state.table.invoices.items.filter((invoice) => {
        return Statuses.generic.active.meetsCondition(invoice)
      })
    }
  },

  methods: {
    changeDateRange(dateRange) {
      this.$store.dispatch('dashboard/CHANGE_DATE_RANGE', dateRange)
    },

    updateDateRangeKey(key) {
      this.$store.dispatch('dashboard/UPDATE_DATE_RANGE_KEY', key)
    },

    changeCurrency(currencyId) {
      this.$store.dispatch('dashboard/CHANGE_CURRENCY', currencyId)
    },

    changeGraphInterval(graphInterval) {
      this.$store.dispatch('dashboard/CHANGE_GRAPH_INTERVAL', graphInterval)
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>