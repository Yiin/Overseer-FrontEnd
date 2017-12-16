import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  props: {
    title: {
      default: 'Expenses'
    }
  },

  computed: {
    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return activity.document.type === 'expense' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    activeExpenses() {
      return this.$store.getters['documents/repositories/expense/ACTIVE_COMPANY_ITEMS']
    },

    visibleExpenses() {
      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, 'day')

      return this.activeExpenses.filter((expense) => {
        return !this.dateRange || moment(expense.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
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
          if (expense.createdAt.isSameOrAfter(startDate) && expense.createdAt.isBefore(nextDate)) {
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
          backgroundColor: gradient(),
          borderColor: '#5867c2',
          data
        }
      ]
    }
  }
}
