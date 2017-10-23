/**
 * Table actions
 */

export default (actions = {}) => Object.assign({
  SET_ROWS_PER_PAGE({ dispatch, commit }, rows) {
    commit('SET_ROWS_PER_PAGE', rows)
    dispatch('NORMALIZE_TABLE')
  },

  NORMALIZE_TABLE({ commit, getters, state }) {
    // remove selected items who no longer exists on the table
    commit('SET_SELECTION', state.selection.filter((item) => getters.filteredItems.indexOf(item) > -1))

    // reset page to last available page, if it's out of bounds
    if (state.page >= getters.pagesCount) {
      commit('SET_PAGE', Math.max(0, getters.pagesCount - 1))
    }
  },

  SET_PAGE({ commit }, page) {
    commit('SET_PAGE', page)
  },

  /**
   * Toggle table row
   */
  TOGGLE_ROW_ON({ commit }, data) {
    commit('TOGGLE_ROW_ON', data)
  },

  TOGGLE_ROW_OFF({ commit }, data) {
    commit('TOGGLE_ROW_OFF', data)
  },

  TOGGLE_ROW({ commit }, data) {
    commit('TOGGLE_ROW', data)
  }
}, actions)
