<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!activeExpenses.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--expenses"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Add a new expense by pressing the button below.
        </div>
        <button @click="create" class="button button--create">
          <span class="icon-new-expense-btn-icon"></span>
          {{ $t('actions.new_expense') }}
        </button>
      </div>
    </template>
    <tabs v-else ref="tabs" labels>
      <simple-tab fade title="Table">
        <documents-table simple
          :data="list"
        >
          <template slot="head">
            <column width="30%">{{ $t('fields.vendor_name') }}</column>
            <column width="30%">{{ $t('fields.client_name') }}</column>
            <column width="20%">{{ $t('fields.date') }}</column>
            <column width="20%">{{ $t('fields.amount') }}</column>
          </template>
          <template slot="columns" slot-scope="{ row }">
            <column width="30%">{{ row.vendor.name }}</column>
            <column width="30%">{{ row.client.name }}</column>
            <column width="20%">{{ row.date | date }}</column>
            <column width="20%">
              <span class="currency">{{ row.amount.currency | currencySymbol }}</span>
              <span class="currency currency--primary">{{ row.amount.amount | currency }}</span>
            </column>
          </template>
        </documents-table>
      </simple-tab>

      <simple-tab fade @state-changed="updateChartTabState" title="Chart">
        <expenses-chart ref="chart" v-if="chartTabIsActive" @update="updateChart"
          class="chart__tab"
          :chart-data="chartData"
          :options="{ responsive: false, legend: { display: false } }"
          :height="473"
          :width="tabWidth"
        ></expenses-chart>
      </simple-tab>
    </tabs>
  </div>
</template>

<script>
import moment from 'moment'
import Tab from '@/components/common/Tabs/Tab.vue'
import ExpensesChart from './charts/ExpensesChart'
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
  Unarchive,
  Recover,
  EditDocument,
  InvoiceExpense
} from '@/modules/table/cm-actions'

export default {
  extends: Tab,

  mixins: [TableMixin],

  components: {
    ExpensesChart,
    'simple-tab': Tab
  },

  props: {
    title: {
      default: 'Expenses'
    }
  },

  data() {
    return {
      tabWidth: 1084,
      chartTabIsActive: false
    }
  },

  computed: {
    name() {
      return 'expenses'
    },

    chartData() {
      return {
        // justToUpdate: [this.dateRange, this.graphInterval],
        labels: this.graphLabels,
        datasets: this.graphDataSets
      }
    },

    contextMenuActions() {
      return [
        SELECTED_ROWS,
        Archive.extend({ moreThanOne: true }),
        Unarchive.extend({ moreThanOne: true }),
        Recover.extend({ moreThanOne: true }),
        Delete.extend({ moreThanOne: true }),
        __SEPARATOR__.isVisible(whenMoreThanOneRowIsSelected),
        TableName.extend({
          title: 'common.expense_table'
        }),
        CreateDocument.extend({
          documentType: 'expense',
          title: 'actions.new_expense',
          icon: 'icon-new-expense-btn-icon'
        }),
        SELECTED_DOCUMENT.extend({ documentType: 'expense' }),
        EditDocument.extend({ title: 'actions.edit_expense' }),
        InvoiceExpense,
        __SEPARATOR__.isVisible(whenSpecificRowIsSelected),
        Archive,
        Unarchive,
        Delete,
        Recover
      ]
    },

    pageItems() {
      return this.visibleExpenses
    },

    activeExpenses() {
      return this.$store.getters['table/expenses/activeItems']
    },

    visibleExpenses() {
      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, 'day')

      return this.activeExpenses.filter((expense) => {
        return !this.dateRange || moment(expense.date)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    tableData() {
      return {
        name: this.name,
        pageList: this.visibleExpenses,
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
        return 'MMM DD, YYYY'
      case 'month':
        return 'MMM YYYY'
      }
    },

    dateRange() {
      return this.$store.state.dashboard.statisticsDateRange || (
          this.activeExpenses && this.activeExpenses.length ? {
            end: this.activeExpenses[this.activeExpenses.length - 1].date,
            start: this.activeExpenses[0].date
          } : null
        )
    },

    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    expensesSumByMonth() {
      let data = {}

      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, this.graphInterval)

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format(this.graphIntervalFormat)

        if (!data[date]) {
          data[date] = 0
        }

        this.visibleExpenses.forEach((expense) => {
          if (expense.date.isSameOrAfter(startDate) && expense.date.isBefore(nextDate)) {
            data[date] += expense.amount.getIn(this.selectedCurrency)
          }
        })
        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    graphLabels() {
      const labels = Object.keys(this.expensesSumByMonth)

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = Object.values(this.expensesSumByMonth)

      data.unshift(null)
      data.push(null)

      return [
        {
          label: 'Expenses',
          backgroundColor: 'transparent',
          borderColor: '#f54d4d',
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
    // this.updateTabWidth()
  },

  mounted() {
    // window.addEventListener('resize', this.updateTabWidth)
  },

  beforeDestroy() {
    // window.removeEventListener('resize', this.updateTabWidth)
  },

  methods: {
    create() {
      createDocument('expense')
    },

    updateChart() {
      if (!this.chartTabIsActive) {
        return
      }
      this.chartTabIsActive = false
      this.$nextTick(() => {
        this.chartTabIsActive = true
      })
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
      this.chartTabIsActive = isActive
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

.chart__tab {
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 15px;
}
</style>
</script>