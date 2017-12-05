<template lang="pug">
  .overview
    statistics
    activities

</template>

<script>
import StatisticsComponent from './Statistics.vue'
import ActivitiesComponent from './Activities.vue'

export default {
  components: {
    'statistics': StatisticsComponent,
    'activities': ActivitiesComponent
  }
}
</script>