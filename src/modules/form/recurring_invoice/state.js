const state = {
  __name: 'recurring_invoice',

  client: '', // uuid

  // Details
  start_date: '', // YYYY-MM-DD
  end_date: '', // YYYY-MM-DD
  po_number: '',
  discount_type: 'percentage',
  discount_value: 0,
  frequency_type: '',
  frequency_value: 0,
  due_date: 0, // 0-31
  autobill: false,

  // Items
  items: [
    /* {
      product_uuid // uuid (products)
      price
      qty
      discount // flat
      tax_rate_uuid // uuid (tax_rates)
      index
    } */
  ],

  // Other Info
  documents: [
    /* array of document files */
  ],
  note_to_client: '',
  terms: '',
  footer: '',

  errors: {}
}

state.__initial = Object.assign({}, state)

export default state
