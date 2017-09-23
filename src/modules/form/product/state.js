const state = {
  __name: 'product',

  uuid: '',

  name: '',
  price: 0,
  currency_id: '', // id
  qty: 1,
  tax_rate_uuid: '', // uuid
  description: '',

  images: [],

  errors: {}
}

state.__initial = Object.assign({}, state)

export default state
