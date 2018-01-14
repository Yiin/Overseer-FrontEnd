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
        :style='timelineStyle'
        :activity-list='activityList'
      )

    .chart__container(v-show='showGraphs')
      line-chart(
        ref='chart'
        :chart-data='chartData'
        :options='chartOptions'
        :height='500'
        :width='1276'
      )
</template>

<script>
import moment from 'moment'
import Tab from '@/components/common/Tabs/Tab.vue'
import Timeline from '@/components/timeline/Timeline.vue'
import AuthorizationHelpersMixin from '@/mixins/authorization/helpers'
import LineChart from '../charts/LineChart'
import Money from '@models/money'

export default {
  extends: Tab,

  mixins: [
    AuthorizationHelpersMixin
  ],

  props: {
    profile: {
      default: null
    },
    enableIf: {
      default: true
    },
    timelineStyle: {
      default: () => {
        return {}
      }
    }
  },

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
    activity() {
      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end).add(1, 'day')

      let activity = []

      if (this.profile) {
        activity = this.profile.activity
      }
      activity = this.$repository('activity').availableItems

      return activity.filter((activity) => {
        return !this.dateRange || moment(activity.timestamp)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    showGraphs() {
      return !this.profile && this.$store.state.dashboard.showGraphs
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
      const options = {
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
                if (value < 1) {
                  value = Money.toFixed(value, 1)
                } else {
                  value = Money.toFixed(value, 0)
                }
                return this.selectedCurrency.symbol + ' ' + value
              }
            }
          }]
        },
        pointRadius: 20,
        pointHitRadius: 50
      }

      options.animation = false
      // if (!this.graphLabels || this.graphLabels.length > 10) {
      // }
      return options
    },

    graphInterval() {
      if (this.dateRange) {
        const duration = moment.duration(moment(this.dateRange.end).diff(moment(this.dateRange.start)))

        const hours = duration.asHours()
        const days = duration.asDays()
        const weeks = duration.asWeeks()
        const months = duration.asMonths()

        if (hours <= 50) {
          return 'hour'
        }

        if (days <= 50) {
          return 'day'
        }

        if (weeks <= 50) {
          return 'week'
        }

        if (months <= 50) {
          return 'month'
        }

        return 'year'
      }
      return this.$store.state.dashboard.statisticsGraphInterval || 'month'
    },

    graphIntervalFormat() {
      switch (this.graphInterval) {
      case 'hour':
        return 'HH:mm'
      case 'day':
      case 'week':
        return 'MMM DD, YY'
      case 'month':
        return 'MMM YYYY'
      case 'year':
        return 'YYYY'
      }
    },

    dateRange() {
      return this.$store.state.dashboard.statisticsDateRange || null
    },

    dateRangeStart() {
      if (!this.dateRange) {
        return null
      }
      return moment(this.dateRange.start).startOf('day')
    },

    dateRangeEnd() {
      if (!this.dateRange) {
        return null
      }
      return moment(this.dateRange.end).add(1, 'day').startOf('day').add(1, this.graphInterval)
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
    updateTabWidth(delay = true) {
      if (!this.$el) {
        return
      }
      this.tabWidth = this.$el.getBoundingClientRect().width

      if (this.$refs.chart && this.$refs.chart._chart) {
        this.$refs.chart.render()
      } else if (!delay) {
        setTimeout(this.updateTabWidth.bind(this, false), 50)
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