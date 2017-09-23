const state = {
  __name: 'quote',

  uuid: '',

  client_uuid: '', // uuid
  quote_date: '', // YYYY-MM-DD
  due_date: '', // YYYY-MM-DD
  partial: 0, // partial/deposit
  quote_number: '',
  po_number: '',
  discount_type: 'percentage',
  discount_value: 0,

  items: [
    /* {
      product_uuid // uuid (products)
      price
      qty
      discount // %
      taxRate // uuid (tax_rates)
    } */
  ],
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
