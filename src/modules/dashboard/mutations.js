export default {
  CHANGE_CURRENCY(state, currency) {
    state.currency = currency
  },

  CHANGE_GRAPH_INTERVAL(state, graphInterval) {
    state.statisticsGraphInterval = graphInterval
  },

  CHANGE_DATE_RANGE(state, dateRange) {
    state.statisticsDateRange = dateRange
  },

  UPDATE_DATE_RANGE_KEY(state, key) {
    state.statisticsDateRangeKey = key
  }
}