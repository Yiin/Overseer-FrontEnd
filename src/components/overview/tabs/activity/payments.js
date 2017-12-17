import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import PaymentsGraphMixin from './mixins/payments'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  mixins: [
    PaymentsGraphMixin
  ],

  props: {
    title: {
      default: 'Payments'
    }
  },

  computed: {
    activityList() {
      return this.activity.filter((activity) => {
        return activity.document.type === 'payment' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    graphLabels() {
      const labels = Object.keys(this.paymentsGraphData).map((time) => moment(time).format(this.graphIntervalFormat))

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = this.paymentsDataSet

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
