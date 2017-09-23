const state = {
  __name: 'expense',

  uuid: '',

  vendor_uuid: '', // uuid
  client_uuid: '', // uuid
  category_uuid: '', // uuid

  // Details
  amount: 0,
  currency_id: null, // id (currencies)
  date: '', // YYYY-MM-DD

  // Documents
  documents: [],

  errors: {}
}

state.__initial = Object.assign({}, state)

export default state
