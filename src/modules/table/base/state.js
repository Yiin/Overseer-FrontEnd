export default (state = {}) => {
  return Object.assign({
    state: 'idle',
    page: 0,
    rows_per_page: 10,
    orderBy: 'createdAt',
    orderDirection: 'desc',
    selection: [],
    selectedRow: null, // row on which context menu was activated
    filterBy: [],
    searchBy: {}
  }, state)
}
