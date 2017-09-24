<template>
  <div>
    <breadcrumb :path="[$t('common.overview')]"></breadcrumb>

    <statistics></statistics>
    <activities></activities>
  </div>
</template>

<script>
import StatistictsComponent from './Statistics.vue'
import ActivitiesComponent from './Activities.vue'

export default {
  components: {
    'statistics': StatistictsComponent,
    'activities': ActivitiesComponent
  }
}
</script>