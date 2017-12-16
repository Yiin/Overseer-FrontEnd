import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  props: {
    title: {
      default: 'Payments'
    }
  },

  computed: {
    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return activity.document.type === 'payment' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    activePayments() {
      return this.$store.getters['documents/repositories/payment/ACTIVE_COMPANY_ITEMS']
    },

    visiblePayments() {
      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, 'day')

      return this.activePayments.filter((payment) => {
        return !this.dateRange || moment(payment.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    paymentsSumByMonth() {
      let data = {}

      if (!this.dateRange) {
        return data
      }

      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, this.graphInterval)

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format(this.graphIntervalFormat)

        if (!data[date]) {
          data[date] = 0
        }

        this.visiblePayments.forEach((payment) => {
          if (payment.createdAt.isSameOrAfter(startDate) && payment.createdAt.isBefore(nextDate)) {
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
          backgroundColor: gradient(),
          borderColor: '#5867c2',
          data
        }
      ]
    }
  }
}
