<template lang="pug">
  .tab(v-show='isActive')
    timeline(
      :activity-list='activityList'
      :style='timelineStyle'
      class='timeline--profile'
    )
</template>

<script>
import Tab from '@/components/common/Tabs/Tab.vue'
import Timeline from '@/components/timeline/Timeline.vue'
import Employee from '@/modules/documents/models/employee'

export default {
  extends: Tab,

  components: {
    Timeline
  },

  props: {
    title: {
      default: 'Timeline'
    },
    profile: {
      type: Object
    },
    timelineStyle: {
      default: () => {
        return {}
      }
    }
  },

  computed: {
    activityList() {
      return this.$store.getters['documents/repositories/activity/AVAILABLE_ITEMS'].filter((activity) => {
        return activity.user && activity.user.uuid === this.profile.userUuid || (
          activity.document.data instanceof Employee && activity.document.data.uuid === this.profile.uuid
        )
      })
    }
  }
}
</script>