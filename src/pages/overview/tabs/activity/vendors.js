import BaseTab from './BaseTab.vue'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  props: {
    title: {
      default: 'Vendors'
    }
  },

  computed: {
    showGraphs() {
      return false
    },

    activityList() {
      return this.activity.filter((activity) => {
        return activity.document.type === 'vendor' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    }
  }
}
