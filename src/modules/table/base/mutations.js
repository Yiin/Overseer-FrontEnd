import Vue from 'vue'

export default (mutations = {}) => {
  return Object.assign({
    SET_TABLE_STATE(state, tableState) {
      state.state = tableState
    },

    SET_TABLE_ITEMS(state, items) {
      Vue.set(state, 'items', items)
      state.itemsRelationsAreUpdated = false
    },

    ITEMS_RELATIONS_ARE_UPDATED(state) {
      state.itemsRelationsAreUpdated = true
    },

    RESET_TABLE(state) {
      state.page = 0
      state.orderBy = 'created_at'
      state.orderDirection = 'desc'
      state.selection = []
      state.filterBy = []
      state.searchBy = {}
    },

    NORMALIZE_TABLE(state) {
      // remove selected items who no longer exists on the table
      state.selection = state.selection.filter((item) => state.items.indexOf(item) > -1)

      // reset page to last available page, if it's out of bounds
      const pageCount = Math.ceil(state.items.length / state.rows_per_page)
      if (state.page >= pageCount) {
        state.page = Math.max(0, pageCount - 1)
      }
    },

    FILTER_BY(state, filters) {
      state.filterBy = filters
    },

    SEARCH_BY(state, filters) {
      state.searchBy = filters
    },

    SET_ROWS_PER_PAGE(state, rows) {
      state.rows_per_page = parseInt(rows)
    },

    SET_PAGE(state, page) {
      state.page = parseInt(page)
    },

    INSERT_ROW(state, row) {
      if (state.items.indexOf(row) < 0) {
        state.items.unshift(row)
      }
    },

    REMOVE_ROW(state, row) {
      state.items = state.items.filter((item) => item.uuid !== row.uuid)
    },

    UPDATE_ROW(state, row) {
      const items = state.items

      const index = items.findIndex((_row) => _row.uuid === row.uuid)

      if (index > -1) {
        for (let key in row) {
          Vue.set(state.items[index], key, row[key])
        }
      }
    },

    TOGGLE_ROW_ON(state, row) {
      const found = state.selection.find((item) => item.uuid === row.uuid)

      if (!found) {
        state.selection.push(row)
      }
    },

    TOGGLE_ROW_OFF(state, row) {
      const found = state.selection.find((item) => item.uuid === row.uuid)

      if (found) {
        state.selection = state.selection.filter((item) => item.uuid !== row.uuid)
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
