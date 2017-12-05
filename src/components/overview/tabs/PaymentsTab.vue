<template lang="pug">
  .tab.tab--dashboard(v-show='isActive')

    //-
      Display placeholder if there are no payments to display

    template(v-if='!payments || !payments.length')
      .placeholder-area
        .placeholder.placeholder--payments
        .placeholder.placeholder--line
        .placeholder__text Add a new payment by pressing the button below.

        button.button.button--create(
          v-if='canCreatePayment'
          @click='create'
        ) {{ $t('actions.new_payment') }}

    //-
      Else show list of the payments

    tabs(
      v-else
      ref='tabs'
      labels
    )
      simple-tab(
        fade
        title='Table'
      )
        documents-table(simple
          :documents='visiblePayments'
          :data='tableData'
          :context-menu-builder='contextMenuBuilder'
        )
          template(slot='head')
            column(width='30%') {{ $t('fields.invoice_number') }}
            column(width='30%') {{ $t('fields.client_name') }}
            column(width='20%') {{ $t('labels.payment_date') }}
            column(width='20%') {{ $t('fields.amount') }}

          template(slot='columns' slot-scope='{ row }')
            column(width='30%') {{ row.invoice.invoiceNumber }}
            column(width='30%') {{ row.client.name }}
            column(width='20%') {{ row.paymentDate | date }}
            column(width='20%')
              span.currency {{ row.amount.currency | currencySymbol }}
              span.currency.currency--primary {{ row.amount.amount | currency }}

      simple-tab(
        fade
        @state-changed='updateChartTabState'
        title='Chart'
      )
        payments-chart(
          ref='chart'
          v-if='chartTabIsActive'
          @update='updateChart'
          :chart-data='chartData'
          :options='chartOptions'
          :height='455'
          :width='tabWidth'
        )
</template>

<script>
import moment from 'moment'
import Tab from '@/components/common/Tabs/Tab.vue'
import PaymentsChart from './charts/PaymentsChart'
import TableMixin from '@/mixins/TableMixin'
import { createDocument } from '@/modules/documents/actions'
import AuthorizationHelpersMixin from '@/mixins/authorization/helpers'

import TableCmItems from '@/modules/table/contextmenu/items'

export default {
  extends: Tab,

  mixins: [
    TableMixin,
    AuthorizationHelpersMixin
  ],

  components: {
    PaymentsChart,
    'simple-tab': Tab
  },

  props: {
    title: {
      default: 'Payments'
    }
  },

  data() {
    return {
      tabWidth: 1084,
      chartTabIsActive: false,
      chartTabTimeout: null
    }
  },

  computed: {
    name() {
      return 'payments'
    },

    contextMenuBuilder() {
      return this.$contextMenu.init({
        tableStateName: this.name
      })
        .addItem(TableCmItems.SELECTED_ROWS)
        .addItem(TableCmItems.ARCHIVE_MANY)
        .addItem(TableCmItems.UNARCHIVE_MANY)
        .addItem(TableCmItems.DELETE_MANY)
        .addItem(TableCmItems.RECOVER_MANY)
        .addSeparator()
        .addItem(TableCmItems.TABLE_NAME)
        .addItem(TableCmItems.CREATE_DOCUMENT)
        .addItem(TableCmItems.SELECTED_DOCUMENT)
        .addItem(TableCmItems.PREVIEW)
        .addItem(TableCmItems.EDIT_DOCUMENT)
        .addItem(TableCmItems.REFUND_PAYMENT)
        .addItem(TableCmItems.HISTORY_LIST)
        .addSeparator()
        .addItem(TableCmItems.ARCHIVE)
        .addItem(TableCmItems.UNARCHIVE)
        .addItem(TableCmItems.DELETE)
        .addItem(TableCmItems.RECOVER)
    },

    payments() {
      return this.$store.getters['table/payments/items']
    },

    visiblePayments() {
      return this.payments.filter((payment) => {
        return !this.dateRange || moment(payment.paymentDate)
          .isBetween(
            moment(this.dateRange.start),
            moment(this.dateRange.end),
            'days',
            '[]' // inclusive
          )
      })
    },

    tableData() {
      return {
        name: this.name,
        pageList: this.visiblePayments,
        selection: this.state.selection
      }
    },

    chartData() {
      return {
        labels: this.graphLabels,
        datasets: this.graphDataSets
      }
    },

    chartOptions() {
      return {
        responsive: false,
        legend: {
          display: false
        }
      }
    },

    graphInterval() {
      return this.$store.state.dashboard.statisticsGraphInterval || 'month'
    },

    graphIntervalFormat() {
      switch (this.graphInterval) {
      case 'day':
      case 'week':
        return 'MMM DD, YY'
      case 'month':
        return 'MMM YYYY'
      }
    },

    dateRange() {
      return this.$store.state.dashboard.statisticsDateRange || (
          this.payments && this.payments.length ? {
            end: this.payments[this.payments.length - 1].paymentDate,
            start: this.payments[0].paymentDate
          } : null
        )
    },

    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    paymentsSumByMonth() {
      let data = {}

      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, this.graphInterval)

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format(this.graphIntervalFormat)

        if (!data[date]) {
          data[date] = 0
        }

        this.visiblePayments.forEach((payment) => {
          if (payment.paymentDate.isSameOrAfter(startDate) && payment.paymentDate.isBefore(nextDate)) {
            data[date] += payment.amount.getIn(this.selectedCurrency)
          }
        })
        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    graphLabels() {
      const labels = Object.keys(this.paymentsSumByMonth)

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = Object.values(this.paymentsSumByMonth)

      data.unshift(null)
      data.push(null)

      return [
        {
          label: 'Payments',
          backgroundColor: 'transparent',
          borderColor: '#5867c2',
          data
        }
      ]
    }
  },

  watch: {
    isActive: function (isActive, wasActive) {
      if (!wasActive && isActive) {
        if (this.$refs.tabs) {
          this.$refs.tabs.reset()
        }
      }
    }
  },

  updated() {
    this.updateTabWidth()
  },

  mounted() {
    window.addEventListener('resize', this.updateTabWidth)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateTabWidth)
  },

  methods: {
    create() {
      createDocument('payment')
    },

    updateChart() {
      if (!this.chartTabIsActive) {
        return
      }
      this.chartTabTimeout = setTimeout(() => {
        this.chartTabIsActive = false
        this.$nextTick(() => {
          this.chartTabIsActive = true
        })
      }, 1000)
    },

    updateTabWidth() {
      if (!this.$el) {
        return
      }
      this.tabWidth = this.$el.getBoundingClientRect().width
      if (this.$refs.chart && this.$refs.chart._chart) {
        this.$refs.chart._chart.update()
      }
    },

    updateChartTabState(isActive) {
      if (this.chartTabTimeout) {
        clearTimeout(this.chartTabTimeout)
        this.chartTabTimeout = null
      }
      if (!isActive) {
        this.chartTabTimeout = setTimeout(() => {
          this.chartTabIsActive = false
          this.$nextTick(() => {
            this.chartTabIsActive = true
          })
        }, 1000)
      } else {
        this.chartTabIsActive = isActive
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-right: 20px;
}
</style>

<style lang="scss">
.tab--dashboard {
  display: flex;
}
</style>