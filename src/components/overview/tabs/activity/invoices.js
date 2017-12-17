import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import InvoicesGraphMixin from './mixins/invoices'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  mixins: [
    InvoicesGraphMixin
  ],

  props: {
    title: {
      default: 'Invoices'
    }
  },

  computed: {
    activityList() {
      return this.activity.filter((activity) => {
        return activity.document.type === 'invoice' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    graphLabels() {
      const labels = Object.keys(this.invoicesGraphData).map((time) => moment(time).format(this.graphIntervalFormat))

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = this.invoicesDataSet

      data.unshift(null)
      data.push(null)

      return [
        {
          label: 'Invoices',
          backgroundColor: gradient(),
          borderColor: '#5867c2',
          pointBackgroundColor: '#5867c2',
          pointHitRadius: 10,
          data
        }
      ]
    }
  }
}
