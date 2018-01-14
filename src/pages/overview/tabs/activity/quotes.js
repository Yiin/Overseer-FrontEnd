import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import QuotesGraphMixin from './mixins/quotes'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  mixins: [
    QuotesGraphMixin
  ],

  props: {
    title: {
      default: 'Quotes'
    }
  },

  computed: {
    activityList() {
      return this.activity.filter((activity) => {
        return activity.document.type === 'quote' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    graphLabels() {
      const labels = Object.keys(this.quotesGraphData).map((time) => moment(time).format(this.graphIntervalFormat))

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = this.quotesDataSet

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
