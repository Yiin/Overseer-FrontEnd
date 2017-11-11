export default (mutations = {}) => {
  return Object.assign({
    SET_TABLE_STATE(state, tableState) {
      state.state = tableState
    },

    RESET_TABLE(state) {
      state.page = 0
      state.orderBy = 'createdAt'
      state.orderDirection = 'desc'
      state.selection = []
      state.filterBy = []
      state.searchBy = {}
    },

    SET_SELECTION(state, selection) {
      state.selection = selection
    },

    SET_SELECTED_ROW(state, row) {
      state.selectedRow = row
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
