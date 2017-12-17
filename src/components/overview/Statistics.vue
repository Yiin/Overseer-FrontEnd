<template lang="pug">
  div

    //-
      Overview header dropdowns

    .row.row--options

      //-
        Data display type
        Tabular / Graphs

      v-switch(
        :label='dataDisplayTypeLabel'
        v-model='showGraphs'
        color='primary'
        hide-details
      )

      //-
        Currency dropdown

      form-dropdown-input.dropdown--primary.dropdown--dashboard-options(
        :items="currencies"
        v-model="selectedCurrencyCode"
      )
        template(slot="option" slot-scope="{ item, parent }")
          v-list-tile(avatar @click="parent.select(item)" tag="div")
            v-list-tile-avatar
              img(:src="require(`@/assets/icons/currency/${item.code.toLowerCase()}.svg`)")
            v-list-tile-content
              v-list-tile-title(v-html="item.code")
              v-list-tile-sub-title(v-html="item.name")

      //-
        Date range helper options

      form-dropdown-input.dropdown--primary.dropdown--dashboard-options(
        :items="predefinedRanges"
        v-model='statisticsDateRangeKey'
        :placeholder="$t('datetime.custom_range')"
      )

      //-
        Date range picker

      range-date-picker.dropdown--primary.dropdown--dashboard-options.dropdown--datepicker(
        v-model="statisticsDateRange"
        @input="changeDateRange"
      )

    //-
      Summary blocks

    .row

      //-
        Revenue

      .block.block--dashboard
        .block__title Total Revenue

        .block__body.block__body--dashboard-statistics
          .value.value__dashboard.value__dashboard--total
            | {{ selectedCurrency.symbol }}
            | {{ totalRevenue | currency }}

          .time-frame-total
            .value.value__dashboard.value__dashboard--time-framed
              | {{ selectedCurrency.symbol }}
              | {{ totalRevenueInDateRange | currency }}

            .time-frame {{ $t('datetime.' + (statisticsDateRangeKey || 'custom_range')) }}

      //-
        Expenses

      .block.block--dashboard
        .block__title Total Expenses

        .block__body.block__body--dashboard-statistics
          .value.value__dashboard.value__dashboard--total
            | {{ selectedCurrency.symbol }}
            | {{ totalExpenses | currency }}

          .time-frame-total
            .value.value__dashboard.value__dashboard--time-framed
              | {{ selectedCurrency.symbol }}
              | {{ totalExpensesInDateRange | currency }}

            .time-frame {{ $t('datetime.' + (statisticsDateRangeKey || 'custom_range')) }}

      //-
        Outstanding invoices

      .block.block--dashboard
        .block__title Total Outstanding

        .block__body.block__body--dashboard-statistics
          .value.value__dashboard.value__dashboard--total
            | {{ selectedCurrency.symbol }}
            | {{ totalOutstanding | currency }}

          .time-frame-total
            .value.value__dashboard.value__dashboard--time-framed
              | {{ selectedCurrency.symbol }}
              | {{ totalOutstandingInDateRange | currency }}

            .time-frame {{ $t('datetime.' + (statisticsDateRangeKey || 'custom_range')) }}

</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import RangeDatePicker from '@/components/common/DatePicker/RangeDatePicker.vue'
import { methods as CurrencyRepository } from '@/modules/documents/repositories/currency'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'
import Money from '@models/money'

export default {
  components: {
    RangeDatePicker
  },

  computed: {
    predefinedRanges() {
      const currentDate = moment()

      return [
        { value: 'today', text: 'Today', start: moment(), end: moment() },
        { value: 'last7', text: this.$t('datetime.last7'), start: moment().subtract(7, 'days'), end: currentDate },
        { value: 'last30', text: this.$t('datetime.last30'), start: moment().subtract(30, 'days'), end: currentDate },
        { value: 'month', text: this.$t('datetime.month'), start: moment().startOf('month'), end: currentDate },
        { value: 'year', text: this.$t('datetime.year'), start: moment().startOf('year'), end: currentDate },
        { value: 'lastyear', text: this.$t('datetime.lastyear'), start: moment().subtract(1, 'year').startOf('year'), end: moment().subtract(1, 'year').endOf('year') }
      ]
    },

    showGraphs: {
      get() {
        return this.$store.state.dashboard.showGraphs
      },
      set(value) {
        this.$store.dispatch('dashboard/SHOW_GRAPHS', value)
      }
    },

    dataDisplayTypeLabel() {
      if (this.showGraphs) {
        return 'Switch to Activity'
      }
      return 'Switch to Graphs'
    },

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

      currencies = currencies.concat([
        'product',
        'invoice',
        'payment',
        'credit',
        'quote',
        'expense'
      ].reduce((arr, documentType) => {
        return arr.concat(
          this.$store.getters[`documents/repositories/${documentType}/AA_ITEMS`]
            .filter(SELECTED_COMPANY_ITEMS)
            .map((document) => document.currency)
        )
      }, []))
        .filter((currency) => !!currency)
        .map((currency) => {
          return {
            value: currency.code,
            text: currency.code,

            ...currency
          }
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

    statisticsDateRangeKey: {
      get() {
        return this.$store.state.dashboard.statisticsDateRangeKey
      },
      set(value) {
        this.changeDateRangeByKey(value)
      }
    },

    totalRevenue() {
      return this.payments.reduce((sum, payment) => {
        return sum + payment.amount.getIn(this.selectedCurrency)
      }, 0)
    },

    totalRevenueInDateRange() {
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
    changeDateRange(dateRange, key = null) {
      console.log('changeDateRange', dateRange)
      if ((
          !dateRange && !this.statisticsDateRange
        ) || (
          dateRange === this.statisticsDateRange
        ) || (
          moment(dateRange.start).isSame(moment(this.statisticsDateRange.start), 'day') &&
          moment(dateRange.end).isSame(moment(this.statisticsDateRange.end), 'day')
      )) {
        return
      }
      this.$store.dispatch('dashboard/CHANGE_DATE_RANGE', dateRange)

      if (moment().isSame(moment(dateRange.start), 'day') && moment().isSame(moment(dateRange.end))) {
        key = 'today'
      }
      this.updateDateRangeKey(key)
    },

    changeDateRangeByKey(key) {
      const predefinedRange = this.predefinedRanges.find((range) => range.value === key)

      if (predefinedRange) {
        this.changeDateRange({
          start: predefinedRange.start,
          end: predefinedRange.end
        }, predefinedRange.value)
      }
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