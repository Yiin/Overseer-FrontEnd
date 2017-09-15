export default (getters) => Object.assign({
  isTableIdle(state) {
    return state.state === 'idle'
  },

  isTableLoading(state) {
    return state.state === 'loading'
  },

  pageItems(state) {
    const items = state.items

    const start = state.page * state.rows_per_page
    const end = start + state.rows_per_page

    return items.slice(start, end)
  },

  pagesCount(state) {
    return Math.ceil(state.items.length / state.rows_per_page)
  }
}, getters)
