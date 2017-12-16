import BaseTab from './BaseTab.vue'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: BaseTab,

  props: {
    title: {
      default: 'Tasks'
    }
  },

  computed: {
    showGraphs() {
      return false
    },

    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return activity.document.type === 'task' && SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    }
  }
}
