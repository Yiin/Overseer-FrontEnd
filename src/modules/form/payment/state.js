const state = {
  uuid: '',

  client_uuid: '', // uuid
  invoice_uuid: '', // uuid

  // Details
  amount: 0,
  currency_id: null, // id (currencies)
  payment_type_id: null, // id (payment_types)
  payment_date: '', // YYYY-MM-DD
  payment_reference: '',

  errors: {}
}

export const defaultState = Object.assign({}, state)

export default state
