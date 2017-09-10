const state = {
  client: '', // uuid
  invoice: '', // uuid

  // Details
  price: 0,
  currency: null, // id (currencies)
  payment_type: null, // id (payment_types)
  payment_date: '', // YYYY-MM-DD
  payment_reference: '',

  errors: {}
}

export default state
