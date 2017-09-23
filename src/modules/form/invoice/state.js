const state = {
  __name: 'invoice',

  uuid: '',

  client_uuid: '', // uuid
  invoice_date: '', // YYYY-MM-DD
  due_date: '', // YYYY-MM-DD
  partial: 0, // partial/deposit
  invoice_number: '',
  po_number: '',
  discount_type: 'percentage',
  discount_value: 0,

  items: [
    /* {
      product_uuid // uuid (products)
      product_name // new product
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
