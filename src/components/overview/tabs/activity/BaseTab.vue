<template lang="pug">
  .tab.tab--dashboard(v-show='isActive')

    template(v-if='!showGraphs')
      template(v-if='!activityList.length')
        .placeholder-area
          .placeholder.placeholder--activity
          .placeholder.placeholder--line
          .placeholder__text
            | Here you can see all the things #[br]
            | that happened recently.

      timeline(
        v-else
        :activity-list='activityList'
      )

    .chart__container(v-show='showGraphs')
      line-chart(
        ref='chart'
        :chart-data='chartData'
        :options='chartOptions'
        :height='500'
        :width='tabWidth'
      )
</template>

<script>
import Tab from '@/components/common/Tabs/Tab.vue'
import Timeline from '@/components/timeline/Timeline.vue'
import AuthorizationHelpersMixin from '@/mixins/authorization/helpers'
import LineChart from '../charts/LineChart'

export default {
  extends: Tab,

  mixins: [
    AuthorizationHelpersMixin
  ],

  components: {
    Timeline,
    LineChart
  },

  data() {
    return {
      tabWidth: 1084
    }
  },

  computed: {
    showGraphs() {
      return this.$store.state.dashboard.showGraphs
    },

    chartData() {
      return {
        labels: this.graphLabels,
        datasets: this.graphDataSets
      }
    },

    selectedCurrency() {
      return this.$store.state.dashboard.currency || this.$store.state.settings.currency
    },

    chartOptions() {
      return {
        responsive: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: true
            }
          }],
          yAxes: [{
            gridLines: {
              display: true
            },
            ticks: {
              // Include currency sign in the ticks
              callback: (value) => {
                return this.selectedCurrency.symbol + ' ' + value
              }
            }
          }]
        },
        pointRadius: 10
      }
    },

    graphInterval() {
      return this.$store.state.dashboard.statisticsGraphInterval || 'month'
    },

    graphIntervalFormat() {
      switch (this.graphInterval) {
      case 'day':
      case 'week':
        return 'MMM DD, YY'
      case 'month':
        return 'MMM YYYY'
      }
    },

    dateRange() {
      return this.$store.state.dashboard.statisticsDateRange || null
    }
  },

  updated() {
    this.updateTabWidth()
  },

  mounted() {
    window.addEventListener('resize', this.updateTabWidth)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateTabWidth)
  },

  methods: {
    updateTabWidth() {
      if (!this.$el) {
        return
      }
      this.tabWidth = this.$el.getBoundingClientRect().width
      if (this.$refs.chart && this.$refs.chart._chart) {
        this.$refs.chart._chart.update()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-right: 20px;
}
</style>

<style lang="scss">
.tab--dashboard {
  display: flex;
}
.chart__container {
  display: flex;
  height: 534px;
  align-items: center;
}
</style>