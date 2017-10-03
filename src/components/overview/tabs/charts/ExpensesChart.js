import { Line } from 'vue-chartjs'

export default {
  extends: Line,

  props: ['chartData', 'options'],

  watch: {
    chartData: function () {
      this.$emit('update')
    }
  },

  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
