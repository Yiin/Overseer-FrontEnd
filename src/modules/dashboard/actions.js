// import Api from '@/api'

export default {
  CHANGE_CURRENCY({ commit, rootState }, currency) {
    commit('CHANGE_CURRENCY', currency)
  },

  CHANGE_GRAPH_INTERVAL({ commit }, graphInterval) {
    commit('CHANGE_GRAPH_INTERVAL', graphInterval)

    // Api.post('dashboard/graph-interval', { graphInterval })
  },

  CHANGE_DATE_RANGE({ commit }, dateRange) {
    commit('CHANGE_DATE_RANGE', dateRange)

    // Api.post('dashboard/date-range', {  })
  },

  UPDATE_DATE_RANGE_KEY({ commit }, key) {
    commit('UPDATE_DATE_RANGE_KEY', key)
  }
}
