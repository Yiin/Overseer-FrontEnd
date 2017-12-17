import debounce from 'debounce'

const saveUserOverviewState = debounce(function (dispatch, state) {
  const ignore = true
  if (ignore) {
    return
  }
  dispatch('auth/SAVE_USER_OVERVIEW_STATE', {
    showGraphs: state.showGraphs,
    currencyCode: state.currency.code,
    dateRange: state.statisticsDateRange,
    dateRangeKey: state.statisticsDateRangeKey
  }, { root: true })
}, 500)

export default {
  SHOW_GRAPHS({ commit, dispatch, state }, showGraphs) {
    commit('SHOW_GRAPHS', showGraphs)

    saveUserOverviewState(dispatch, state)
  },

  /**
   * Change currency in overview
   * @param {Currency} currency Currency model object
   */
  CHANGE_CURRENCY({ commit, dispatch, state }, currency) {
    commit('CHANGE_CURRENCY', currency)

    saveUserOverviewState(dispatch, state)
  },

  CHANGE_GRAPH_INTERVAL({ commit }, graphInterval) {
    commit('CHANGE_GRAPH_INTERVAL', graphInterval)

    // Api.post('dashboard/graph-interval', { graphInterval })
  },

  CHANGE_DATE_RANGE({ commit, dispatch, state }, dateRange) {
    commit('CHANGE_DATE_RANGE', dateRange)

    saveUserOverviewState(dispatch, state)
  },

  UPDATE_DATE_RANGE_KEY({ commit, dispatch, state }, dateRangeKey) {
    commit('UPDATE_DATE_RANGE_KEY', dateRangeKey)

    saveUserOverviewState(dispatch, state)
  }
}
