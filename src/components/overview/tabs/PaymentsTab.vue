<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!payments || !payments.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--payments"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Add a new payment by pressing the button below.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-payment-btn-icon"></span>
          {{ $t('actions.new_payment') }}
        </button>
      </div>
    </template>
    <tabs v-else ref="tabs" labels>
      <simple-tab fade title="Table">
        <documents-table simple
          :documents="visiblePayments"
          :data="tableData"
          :context-menu-actions="contextMenuActions"
        >
          <template slot="head">
            <column width="30%">{{ $t('fields.invoice_number') }}</column>
            <column width="30%">{{ $t('fields.client_name') }}</column>
            <column width="20%">{{ $t('labels.payment_date') }}</column>
            <column width="20%">{{ $t('fields.amount') }}</column>
          </template>
          <template slot="columns" slot-scope="props">
            <column width="30%">{{ props.row.invoice.invoice_number }}</column>
            <column width="30%">{{ props.row.client.name }}</column>
            <column width="20%">{{ props.row.payment_date | date }}</column>
            <column width="20%">
              <span class="currency">{{ props.row.currency | currencySymbol }}</span>
              <span class="currency currency--primary">{{ props.row.amount | currency }}</span>
            </column>
          </template>
        </documents-table>
      </simple-tab>

      <simple-tab fade @state-changed="updateChartTabState" title="Chart">
        <payments-chart ref="chart" v-if="chartTabIsActive" @update="updateChart"
          :chart-data="{
            labels: this.graphLabels,
            datasets: this.graphDataSets
          }"
          :options="{ responsive: false, legend: { display: false } }"
          :height="455"
          :width="tabWidth"
        ></payments-chart>
      </simple-tab>
    </tabs>
  </div>
</template>

<script>
import moment from 'moment'
import Tab from '@/components/common/Tabs/Tab.vue'
import PaymentsChart from './charts/PaymentsChart'
import TableMixin from '@/mixins/TableMixin'
import { createDocument } from '@/modules/documents/actions'

import {
  whenMoreThanOneRowIsSelected,
  whenSpecificRowIsSelected,
  __SEPARATOR__,
  SELECTED_ROWS,
  SELECTED_DOCUMENT,
  TableName,
  CreateDocument,
  Archive,
  Delete,
  EditDocument,
  RefundPayment
} from '@/modules/table/cm-actions'

export default {
  extends: Tab,

  mixins: [TableMixin],

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

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.payment_table'
        }),
        CreateDocument.extend({
          documentType: 'payment',
          title: 'actions.new_payment',
          icon: 'icon-new-payment-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'payment' }),
        EditDocument.extend({ title: 'actions.edit_payment' }),
        RefundPayment,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Delete
      ]
    },

    payments() {
      return this.$store.getters['table/payments/items']
    },

    visiblePayments() {
      return this.payments.filter((payment) => {
        return !this.dateRange || moment(payment.payment_date)
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
            end: this.payments[this.payments.length - 1].payment_date,
            start: this.payments[0].payment_date
          } : null
        )
    },

    paymentsSumByMonth() {
      // let data = {}

      const startDate = moment(this.dateRange.start).startOf('day')
      const currentDate = moment(this.dateRange.start).startOf('day')
      const endDate = moment(this.dateRange.end).endOf('day')

      const steps = {}

      do {
        const date = currentDate.format(this.graphIntervalFormat)
        const key = currentDate.format('YYYYMMDD')

        steps[key] = {
          date,
          value: 0
        }

        currentDate.add(1, this.graphInterval)
      }
      while (currentDate.isBetween(startDate, endDate, '[]'))

      this.visiblePayments.forEach((payment) => {
        const paymentDate = moment(payment.payment_date).format('YYYYMMDD')

        steps[paymentDate].value += parseFloat(payment.amount)
      })

      return steps
    },

    graphLabels() {
      const labels = Object.values(this.paymentsSumByMonth).map((val) => val.date)

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = Object.values(this.paymentsSumByMonth).map((val) => val.value)

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

    updateTabWidth: function () {
      if (!this.$el) {
        return
      }
      this.tabWidth = this.$el.getBoundingClientRect().width
      if (this.$refs.chart) {
        this.$refs.chart._chart.update()
      }
    }.bind(this),

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