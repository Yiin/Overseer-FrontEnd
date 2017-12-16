import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  props: {
    title: {
      default: 'Quotes'
    }
  },

  computed: {
    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return activity.document.type === 'quote' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    activeQuotes() {
      return this.$store.getters['documents/repositories/quote/ACTIVE_COMPANY_ITEMS']
    },

    visibleQuotes() {
      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, 'day')

      return this.activeQuotes.filter((quote) => {
        return !this.dateRange || moment(quote.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    quotesSumByMonth() {
      let data = {}

      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, this.graphInterval)

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format(this.graphIntervalFormat)

        if (!data[date]) {
          data[date] = 0
        }

        this.visibleQuotes.forEach((quote) => {
          if (quote.createdAt.isSameOrAfter(startDate) && quote.createdAt.isBefore(nextDate)) {
            data[date] += quote.amount.getIn(this.selectedCurrency)
          }
        })
        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    graphLabels() {
      const labels = Object.keys(this.quotesSumByMonth)

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = Object.values(this.quotesSumByMonth)

      data.unshift(null)
      data.push(null)

      return [
        {
          label: 'Quotes',
          backgroundColor: gradient(),
          borderColor: '#5867c2',
          data
        }
      ]
    }
  }
}
