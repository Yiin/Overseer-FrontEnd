const state = {
  uuid: '',

  product_name: '',
  price: 0,
  currency_id: '', // id
  qty: 1,
  tax_rate_uuid: '', // uuid
  description: '',

  images: [],

  errors: {}
}

export const defaultState = Object.assign({}, state)

export default state
