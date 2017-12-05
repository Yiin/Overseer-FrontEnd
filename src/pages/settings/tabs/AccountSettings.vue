<template lang="pug">
  .tab(v-show='isActive')
    h2 Account Settings
</template>

<script>
import Tab from '@/components/common/Tabs/Tab.vue'

export default {
  extends: Tab,

  props: {
    title: {
      default: 'Account Settings'
    }
  }
}
</script>