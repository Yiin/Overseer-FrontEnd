<template lang="pug">
  .tab.tab--dashboard(v-show='isActive')
    template(v-if='!activityList.length')
      .placeholder-area
        .placeholder.placeholder--activity
        .placeholder.placeholder--line
        .placeholder__text
          | Here you can see all the things #[br]
          | that happened recently.

    timeline(v-else :activity-list='activityList')
</template>

<script>
import Tab from '@/components/common/Tabs/Tab.vue'
import Timeline from '@/components/timeline/Timeline.vue'
import { SELECTED_COMPANY_ITEMS } from '@/modules/documents/helpers/filters'

export default {
  extends: Tab,

  components: {
    Timeline
  },

  props: {
    title: {
      default: 'All Activity'
    }
  },

  computed: {
    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return SELECTED_COMPANY_ITEMS(activity.document.data)
      })
    }
  }
}
</script>