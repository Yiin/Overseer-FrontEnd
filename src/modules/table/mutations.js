import Vue from 'vue'

export default (mutations = {}) => {
  return Object.assign({
    SET_TABLE_STATE(state, tableState) {
      state.state = tableState
    },

    SET_TABLE_ITEMS(state, items) {
      state.items = items
    },

    NORMALIZE_TABLE(state) {
      // remove selected items who no longer exists on the table
      state.selection = state.selection.filter((item) => state.items.indexOf(item) > -1)

      // reset page to last available page, if it's out of bounds
      const pageCount = Math.ceil(state.items.length / state.rows_per_page)
      if (state.page >= pageCount) {
        state.page = pageCount - 1
      }
    },

    INSERT_ROW(state, row) {
      if (state.list.indexOf(row) < 0) {
        state.list.unshift(row)
      }
    },

    REMOVE_ROW(state, row) {
      state.list = state.list.filter((item) => item.uuid !== row.uuid)
    },

    UPDATE_ROW(state, row) {
      const list = state.list

      const index = list.findIndex((_row) => _row.uuid === row.uuid)

      if (index > -1) {
        Vue.set(state.list, index, row)
      }
    },

    TOGGLE_ROW(state, row) {
      const found = state.selection.find((item) => item.uuid === row.uuid)

      if (found) {
        state.selection = state.selection.filter((item) => item.uuid !== row.uuid)
      } else {
        state.selection.push(row)
      }
    }
  }, mutations)
}
