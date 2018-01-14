import moment from 'moment'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'
import BaseTab from './BaseTab.vue'

import CreditsGraphMixin from './mixins/credits'
import ExpensesGraphMixin from './mixins/expenses'
import InvoicesGraphMixin from './mixins/invoices'
import PaymentsGraphMixin from './mixins/payments'
import QuotesGraphMixin from './mixins/quotes'

export default {
  extends: BaseTab,

  mixins: [
    CreditsGraphMixin,
    ExpensesGraphMixin,
    InvoicesGraphMixin,
    PaymentsGraphMixin,
    QuotesGraphMixin
  ],

  props: {
    title: {
      default: 'All Activity'
    }
  },

  computed: {
    activityList() {
      return this.activity.filter((activity) => {
        return SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    graphLabels() {
      const labels = Object.keys(this.creditsGraphData).map((time) => moment(time).format(this.graphIntervalFormat))

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const dataSets = [
        { dataSet: this.creditsDataSet, label: 'Credits', color: 'orange' },
        { dataSet: this.expensesDataSet, label: 'Expenses', color: 'red' },
        { dataSet: this.invoicesDataSet, label: 'Invoices', color: 'blue' },
        { dataSet: this.paymentsDataSet, label: 'Payments', color: 'green' },
        { dataSet: this.quotesDataSet, label: 'Quotes', color: 'lightblue' }
      ].map(({ dataSet, label, color }) => {
        dataSet.unshift(null)
        dataSet.push(null)

        return {
          label,
          backgroundColor: 'transparent',
          borderColor: color,
          pointBackgroundColor: color,
          pointHitRadius: 30,
          data: dataSet
        }
      })

      console.log('dataSets', dataSets)

      return dataSets
    }
  }
}
