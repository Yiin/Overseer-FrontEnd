import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  props: {
    title: {
      default: 'Invoices'
    }
  },

  computed: {
    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return activity.document.type === 'invoice' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    activeInvoices() {
      return this.$store.getters['documents/repositories/invoice/ACTIVE_COMPANY_ITEMS']
    },

    visibleInvoices() {
      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, 'day')

      return this.activeInvoices.filter((invoice) => {
        return !this.dateRange || moment(invoice.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    invoicesSumByMonth() {
      let data = {}

      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, this.graphInterval)

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format(this.graphIntervalFormat)

        if (!data[date]) {
          data[date] = 0
        }

        this.visibleInvoices.forEach((invoice) => {
          if (invoice.createdAt.isSameOrAfter(startDate) && invoice.createdAt.isBefore(nextDate)) {
            data[date] += invoice.amount.getIn(this.selectedCurrency)
          }
        })
        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    graphLabels() {
      const labels = Object.keys(this.invoicesSumByMonth)

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = Object.values(this.invoicesSumByMonth)

      data.unshift(null)
      data.push(null)

      return [
        {
          label: 'Invoices',
          backgroundColor: gradient(),
          borderColor: '#5867c2',
          data,
          pointBackgroundColor: '#5867c2',
          pointHitRadius: 10
        }
      ]
    }
  }
}
