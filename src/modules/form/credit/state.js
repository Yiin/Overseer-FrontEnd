const state = {
  __name: 'credit',

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

state.__initial = Object.assign({}, state)

export default state
