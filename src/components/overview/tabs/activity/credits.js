import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  props: {
    title: {
      default: 'Credits'
    }
  },

  computed: {
    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return activity.document.type === 'credit' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    activeCredits() {
      return this.$store.getters['documents/repositories/credit/ACTIVE_COMPANY_ITEMS']
    },

    visibleCredits() {
      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, 'day')

      return this.activeCredits.filter((credit) => {
        return !this.dateRange || moment(credit.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    creditsSumByMonth() {
      let data = {}

      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, this.graphInterval)

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format(this.graphIntervalFormat)

        if (!data[date]) {
          data[date] = 0
        }

        this.visibleCredits.forEach((credit) => {
          if (credit.createdAt.isSameOrAfter(startDate) && credit.createdAt.isBefore(nextDate)) {
            data[date] += credit.balance.getIn(this.selectedCurrency)
          }
        })
        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    graphLabels() {
      const labels = Object.keys(this.creditsSumByMonth)

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = Object.values(this.creditsSumByMonth)

      data.unshift(null)
      data.push(null)

      return [
        {
          label: 'Credits',
          backgroundColor: gradient(),
          borderColor: '#5867c2',
          data
        }
      ]
    }
  }
}
