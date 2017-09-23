export default (state = {}) => {
  return Object.assign({
    state: 'idle',
    itemsRelationsAreUpdated: false,
    page: 0,
    rows_per_page: 3,
    orderBy: 'created_at',
    orderDirection: 'desc',
    items: [],
    selection: [],
    filterBy: [],
    searchBy: {}
  }, state)
}
