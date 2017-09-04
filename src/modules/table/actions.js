/**
 * Table actions
 */
import Api from '@/api'
import * as mutations from './mutation-types'

export default {
  /**
   * Load table data
   */
  LOAD_TABLE({ commit, getters }, { name }) {
    commit(mutations.PRELOAD_TABLE, { name })

    const { page, amount, orderBy, orderDirection } = getters[name]

    Api.get(name, {
      params: {
        p: page,
        a: amount,
        ob: orderBy,
        od: orderDirection
      }
    }).then((response) => {
      commit(mutations.UPDATE_TABLE, { name, data: response })
    })
  },

  FILTER_BY({ commit, state, dispatch }, { name, filter }) {
    commit(mutations.TOGGLE_FILTER_BY, { name, filter })

    dispatch('loadTable', { name })
  },

  CREATE_ENTITY({ commit, dispatch }, { tableName, data }) {
    Api.post(tableName, data)
      .then((response) => {
        dispatch('INSERT_ROW', { table: tableName, row: response })
        dispatch('CLOSE_MODAL', { root: true })
      })
  },

  SAVE_ENTITY({ commit, dispatch }, { tableName, data }) {
    Api.put(`${tableName}/${data.product.key}`, data)
      .then((response) => {
        dispatch('UPDATE_ROW', { table: tableName, row: response })
        dispatch('CLOSE_MODAL', { root: true })
      })
  },

  INSERT_ROW({ commit }, data) {
    commit(mutations.INSERT_ROW, data)
  },

  UPDATE_ROW({ commit }, data) {
    commit(mutations.UPDATE_ROW, data)
  },

  /**
   * Toggle table row
   */
  TOGGLE_ROW({ commit }, data) {
    commit(mutations.TOGGLE_ROW, data)
  }
}
