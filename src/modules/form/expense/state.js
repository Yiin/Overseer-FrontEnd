const state = {
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

export const defaultState = Object.assign({}, state)

export default state
