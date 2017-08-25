import List from '@/models/List'

export const STORAGE_KEY = 'state'

let state = {
  auth: {
    isLoggedIn: false,
    accessToken: null
  },
  user: {
    first_name: null,
    last_name: null
  },
  lists: {
    products: Object.assign({}, List),
    clients: Object.assign({}, List),
    invoices: Object.assign({}, List),
    recurring_invoices: Object.assign({}, List),
    payments: Object.assign({}, List),
    expenses: Object.assign({}, List),
    credits: Object.assign({}, List),
    quotes: Object.assign({}, List),
    vendors: Object.assign({}, List)
  }
}

// Sync with local storage.
if (localStorage.getItem(STORAGE_KEY)) {
  state = Object.assign(state, JSON.parse(localStorage.getItem(STORAGE_KEY)))
}

// Merge data and export it.
export default state
