/**
 * Table actions
 */
import Api from '@/api'

export default (actions = {}) => Object.assign({
  /**
   * Load table data
   */
  LOAD_TABLE({ commit, state }) {
    const name = state.name

    commit('SET_TABLE_STATE', 'loading')

    Api.get('all-' + name.replace(/_/g, '-')).then((response) => {
      commit('SET_TABLE_ITEMS', response)
      commit('NORMALIZE_TABLE')
      commit('SET_TABLE_STATE', 'idle')
    })
  },

  /**
   * Send API request to create a document
   */
  CREATE_DOCUMENT({ commit, dispatch, state }, data) {
    const name = state.name

    return Api.post(name.replace(/_/g, '-'), data)
      .then((response) => {
        dispatch('INSERT_ROW', response)
        dispatch('CLOSE_MODAL', { root: true })
      })
  },

  /**
   * Send API request to save a document
   */
  SAVE_DOCUMENT({ commit, dispatch, state }, { uuid, data }) {
    const name = state.name

    return Api.put(name.replace(/_/g, '-') + `/${uuid}`, data)
      .then((response) => {
        if (response.error) {
          return response
        }
        dispatch('UPDATE_ROW', response)
        dispatch('CLOSE_MODAL', { root: true })
      })
  },

  INSERT_ROW({ commit }, data) {
    commit('INSERT_ROW', data)
  },

  UPDATE_ROW({ commit }, data) {
    commit('UPDATE_ROW', data)
  },

  /**
   * Toggle table row
   */
  TOGGLE_ROW({ commit }, data) {
    commit('TOGGLE_ROW', data)
  }
}, actions)
