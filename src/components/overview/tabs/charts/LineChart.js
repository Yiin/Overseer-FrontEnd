import { Line } from 'vue-chartjs'

export default {
  extends: Line,

  props: ['chartData', 'options'],

  watch: {
    chartData: {
      handler: function () {
        this.render()
      },
      deep: true
    }
  },

  updated() {
    this.render()
  },

  mounted() {
    this.render()
  },

  methods: {
    render() {
      if (this.$data._chart) {
        this.$data._chart.destroy()
      }
      this.renderChart(this.chartData, this.options)
    }
  }
}
