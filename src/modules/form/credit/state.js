const state = {
  uuid: '',

  // Client
  client_uuid: '', // uuid

  // Details
  amount: 0,
  currency_id: '', // id
  credit_date: '', // YYYY-MM-DD
  credit_number: '',

  errors: {}
}

export const defaultState = Object.assign({}, state)

export default state
