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
      return this.profile.activity
    }
  }
}
</script>