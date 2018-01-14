import moment from 'moment'
import gradient from '../charts/gradient'
import BaseTab from './BaseTab.vue'
import ExpensesGraphMixin from './mixins/expenses'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  mixins: [
    ExpensesGraphMixin
  ],

  props: {
    title: {
      default: 'Expenses'
    }
  },

  computed: {
    activityList() {
      return this.activity.filter((activity) => {
        return activity.document.type === 'expense' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    },

    graphLabels() {
      const labels = Object.keys(this.expensesGraphData).map((time) => moment(time).format(this.graphIntervalFormat))

      labels.unshift('')
      labels.push('')

      return labels
    },

    graphDataSets() {
      const data = this.expensesDataSet

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
