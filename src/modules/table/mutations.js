import Vue from 'vue'
import * as types from './mutation-types'

export default {
  [types.PRELOAD_TABLE](state, { name }) {
    state[name].loading = true
  },

  [types.UPDATE_TABLE](state, { name, data }) {
    state[name].loading = false
    state[name].page = Math.min(Math.max(state[name].page, 0), data.pages)
    state[name].pages = data.pages
    state[name].list = data.rows
    state[name].total = data.total
  },

  [types.INSERT_ROW](state, { table, row }) {
    state[table].list.unshift(row)
  },

  [types.UPDATE_ROW](state, { table, row }) {
    const list = state[table].list

    const index = list.findIndex((_row) => _row.key === row.key)

    if (index > -1) {
      Vue.set(state[table].list, index, row)
    }
  },

  [types.TOGGLE_FILTER_BY](state, { name, filter }) {
    console.log('toggle', name, filter)
  },

  [types.TOGGLE_ROW](state, { name, row }) {
    const list = state[name]

    const found = list.selection.find((item) => item === row)

    if (found) {
      list.selection = list.selection.filter((item) => item !== row)
    } else {
      list.selection.push(row)
    }

    state[name] = list
  }
}
