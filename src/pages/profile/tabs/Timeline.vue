<template lang="pug">
  .tab(v-show='isActive')
    timeline(:activity-list='activityList')
</template>

<script>
import Tab from '@/components/common/Tabs/Tab.vue'
import Timeline from '@/components/timeline/Timeline.vue'

export default {
  extends: Tab,

  components: {
    Timeline
  },

  props: {
    title: {
      default: 'Timeline'
    },
    user: {
      type: Object
    }
  },

  computed: {
    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return activity.user && activity.user.uuid === this.user.uuid
      })
    }
  }
}
</script>