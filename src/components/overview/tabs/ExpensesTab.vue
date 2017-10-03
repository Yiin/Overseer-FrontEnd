<template>
  <div v-show="isActive" class="tab tab--dashboard">
    <template v-if="!expenses || !expenses.length">
      <div class="placeholder-area">
        <div class="placeholder placeholder--expenses"></div>
        <div class="placeholder placeholder--line"></div>
        <div class="placeholder__text">
          Add a new expense by pressing the button below.
        </div>
        <a @click="create" class="button button--create">
          <span class="icon-new-expense-btn-icon"></span>
          {{ $t('actions.new_expense') }}
        </a>
      </div>
    </template>
    <tabs v-else ref="tabs" labels>
      <tab fade title="Table">
        <documents-table simple
          :documents="expenses"
        >
          <template slot="head">
            <column width="30%">{{ $t('fields.vendor_name') }}</column>
            <column width="30%">{{ $t('fields.client_name') }}</column>
            <column width="20%">{{ $t('fields.date') }}</column>
            <column width="20%">{{ $t('fields.amount') }}</column>
          </template>
          <template slot="columns" scope="props">
            <column width="30%">{{ props.row.vendor.company_name }}</column>
            <column width="30%">{{ props.row.client.name }}</column>
            <column width="20%">{{ props.row.date | date }}</column>
            <column width="20%">
              <span class="currency">{{ props.row.currency | currencySymbol }}</span>
              <span class="currency currency--primary">{{ props.row.amount | currency }}</span>
            </column>
          </template>
        </documents-table>
      </tab>

      <tab fade @state-changed="updateChartTabState" title="Chart">
        <expenses-chart ref="chart" v-if="chartTabIsActive" @update="updateChart"
          :chart-data="chartData"
          :options="{ responsive: false, legend: { display: false } }"
          :height="473"
          :width="tabWidth"
        ></expenses-chart>
      </tab>
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
  EditDocument,
  InvoiceExpense
} from '@/modules/table/cm-actions'

export default {
  extends: Tab,

  mixins: [TableMixin],

  components: {
    ExpensesChart
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
        Archive.isVisible(whenMoreThanOneRowIsSelected),
        Delete.isVisible(whenMoreThanOneRowIsSelected),
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
        Delete
      ]
    },

    expenses() {
      return this.state.items
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

    expensesSumByMonth() {
      let data = {}

      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, 'day')

      do {
        const date = startDate.format(this.graphIntervalFormat)

        if (!data[date]) {
          data[date] = 0
        }

        this.visibleExpenses.forEach((expense) => {
          const expenseDate = moment(expense.date).format(this.graphIntervalFormat)

          if (expenseDate === date) {
            data[date] += parseFloat(expense.amount)
          } else {
            console.log(expenseDate, expense.amount)
          }
        })
        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSame(endDate, this.graphInterval))

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
          borderColor: '#5867c2',
          data
        }
      ]
    }
  },

  watch: {
    isActive: function (isActive, wasActive) {
      if (!wasActive && isActive) {
        this.$refs.tabs.reset()
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
</style>
</script>