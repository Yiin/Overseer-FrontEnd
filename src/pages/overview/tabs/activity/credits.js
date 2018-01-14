import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import CreditsGraphMixin from './mixins/credits'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  mixins: [
    CreditsGraphMixin
  ],

  props: {
    title: {
      default: 'Credits'
    }
  },

  computed: {
    activityList() {
      return this.activity.filter((activity) => {
        return activity.document.type === 'credit' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    graphLabels() {
      const labels = Object.keys(this.creditsGraphData).map((time) => moment(time).format(this.graphIntervalFormat))

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = this.creditsDataSet

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
