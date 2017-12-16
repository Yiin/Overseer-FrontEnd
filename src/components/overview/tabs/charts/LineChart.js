import { Line } from 'vue-chartjs'

export default {
  extends: Line,

  props: ['chartData', 'options'],

  watch: {
    chartData: {
      handler: function () {
        console.log('chartData changed')
        this.$data._chart.update()
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
      console.log('render')
      this.renderChart(this.chartData, this.options)
    }
  }
}
