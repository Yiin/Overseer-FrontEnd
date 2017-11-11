<template>
  <div>
    <div class="row row--options">
      <form-dropdown-input class="dropdown--primary dropdown--dashboard-options"
        :items="currencies"
        v-model="selectedCurrencyCode"
      >
        <template slot="option" slot-scope="{ item, parent }">
          <v-list-tile avatar @click="parent.select(item)" tag="div">
            <v-list-tile-avatar>
              <img :src="`http://www.xe.com/themes/xe/images/flags/svg/${item.code.toLowerCase()}.svg`">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="item.code"></v-list-tile-title>
              <v-list-tile-sub-title v-html="item.name"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </form-dropdown-input>

      <form-dropdown-input class="dropdown--primary dropdown--dashboard-options"
        :items="graphIntervals"
        v-model="selectedGraphInterval"
      ></form-dropdown-input>

      <range-date-picker
        class="dropdown--primary dropdown--dashboard-options dropdown--datepicker"
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
            {{ totalRevenue | currency }}
          </div>
          <div class="time-frame-total">
            <div class="value value__dashboard value__dashboard--time-framed">
              {{ selectedCurrency.symbol }}
              {{ totalRevenueInDateRange | currency }}
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
            {{ totalExpenses | currency }}
          </div>
          <div class="time-frame-total">
            <div class="value value__dashboard value__dashboard--time-framed">
              {{ selectedCurrency.symbol }}
              {{ totalExpensesInDateRange | currency }}
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
            {{ totalOutstanding | currency }}
          </div>
          <div class="time-frame-total">
            <div class="value value__dashboard value__dashboard--time-framed">
              {{ selectedCurrency.symbol }}
              {{ totalOutstandingInDateRange | currency }}
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
import { methods as CurrencyRepository } from '@/modules/documents/repositories/currency'
import Money from '@/modules/documents/models/money'
import RangeDatePicker from '@/components/common/DatePicker/RangeDatePicker.vue'

export default {
  components: {
    RangeDatePicker
  },

  computed: {
    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    selectedCurrencyCode: {
      get() {
        return this.selectedCurrency.code
      },
      set(code) {
        this.changeCurrency(code)
      }
    },

    currencies() {
      let currencies = [this.selectedCurrency]
        .concat(this.$store.getters['documents/repositories/product/AA_ITEMS'].map((product) => product.price.currency))
        .concat(this.$store.getters['documents/repositories/invoice/AA_ITEMS'].map((invoice) => invoice.currency))
        .concat(this.$store.getters['documents/repositories/payment/AA_ITEMS'].map((payment) => payment.amount.currency))
        .concat(this.$store.getters['documents/repositories/credit/AA_ITEMS'].map((credit) => credit.amount.currency))
        .concat(this.$store.getters['documents/repositories/quote/AA_ITEMS'].map((quote) => quote.currency))
        .concat(this.$store.getters['documents/repositories/expense/AA_ITEMS'].map((expense) => expense.amount.currency))
        .filter((currency) => !!currency)
        .map((currency) => {
          return Object.assign({
            value: currency.code,
            text: currency.code
          }, currency)
        })

      return _.uniqBy(currencies, 'code')
    },

    graphIntervals() {
      return [
        { value: 'day', text: this.$t('common.day') },
        { value: 'week', text: this.$t('common.week') },
        { value: 'month', text: this.$t('common.month') }
      ]
    },

    selectedGraphInterval: {
      get() {
        return this.$store.state.dashboard.statisticsGraphInterval
      },
      set(value) {
        this.changeGraphInterval(value)
      }
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
        return sum + payment.amount.getIn(this.selectedCurrency)
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
        return sum + payment.amount.getIn(this.selectedCurrency)
      }, 0)
    },

    totalExpenses() {
      return this.expenses.reduce((sum, expense) => {
        return sum + expense.amount.getIn(this.selectedCurrency)
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
        return sum + expense.amount.getIn(this.selectedCurrency)
      }, 0)
    },

    totalOutstanding() {
      return this.invoices.reduce((sum, invoice) => {
        return sum + Money.create({
          amount: Math.max(0, parseFloat(invoice.amount.amount) - parseFloat(invoice.paidIn.amount)),
          currency: invoice.currency
        }).getIn(this.selectedCurrency)
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
        return sum + Money.create({
          amount: Math.max(0, parseFloat(invoice.amount.amount) - parseFloat(invoice.paidIn.amount)),
          currency: invoice.currency
        }).getIn(this.selectedCurrency)
      }, 0)
    },

    payments() {
      return this.$store.getters['table/payments/activeItems']
    },

    expenses() {
      return this.$store.getters['table/expenses/activeItems']
    },

    invoices() {
      return this.$store.getters['table/invoices/activeItems']
    }
  },

  mounted() {
    if (!this.$store.state.dashboard.currency) {
      this.$store.dispatch('dashboard/CHANGE_CURRENCY', this.$store.state.settings.currency)
    }
  },

  methods: {
    changeDateRange(dateRange) {
      this.$store.dispatch('dashboard/CHANGE_DATE_RANGE', dateRange)
    },

    updateDateRangeKey(key) {
      this.$store.dispatch('dashboard/UPDATE_DATE_RANGE_KEY', key)
    },

    changeCurrency(currencyCode) {
      const currency = CurrencyRepository.findOrDefault(currencyCode)
      this.$store.dispatch('dashboard/CHANGE_CURRENCY', currency)
    },

    changeGraphInterval(graphInterval) {
      this.$store.dispatch('dashboard/CHANGE_GRAPH_INTERVAL', graphInterval)
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>