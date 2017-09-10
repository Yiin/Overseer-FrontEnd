const tableState = (state = {}) => {
  return Object.assign({
    loading: false,
    page: 0,
    pages: 1,
    amount: 10,
    total: 0,
    orderBy: 'created_at',
    orderDirection: 'desc',
    list: [],
    selection: [],
    filterBy: [],
    searchBy: {}
  }, state)
}

const state = {
  products: tableState(),
  clients: tableState(),
  invoices: tableState(),
  recurring_invoices: tableState(),
  payments: tableState(),
  expenses: tableState(),
  credits: tableState(),
  quotes: tableState(),
  vendors: tableState()
}

export default state
