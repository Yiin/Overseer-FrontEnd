const state = {
  client: '', // uuid

  // Details
  invoice_date: '', // YYYY-MM-DD
  end_date: '', // YYYY-MM-DD
  partial: 0, // partial/deposit
  invoice_number: '',
  po_number: '',
  discount: { // global
    type: 'percent',
    value: 0
  },
  frequency: '', // val:type,
  due_date: 0, // 0-31
  autobill: false,

  // Items
  items: [
    /* {
      product // uuid (products)
      price
      qty
      discount // flat
      tax // uuid (tax_rates)
    } */
  ],

  // Other Info
  documents: [
    /* array of document files */
  ],
  note_to_client: '',
  terms: '',
  footer: ''
}

export default state
