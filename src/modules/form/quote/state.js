const state = {
  client: '', // uuid
  quote_date: '', // YYYY-MM-DD
  due_date: '', // YYYY-MM-DD
  partial: 0, // partial/deposit
  quote_number: '',
  po_number: '',
  discount: { // global
    type: 'percent',
    value: 0
  },
  items: [
    /* {
      product // uuid (products)
      price
      qty
      discount // flat
      tax // uuid (tax_rates)
    } */
  ],
  documents: [
    /* array of document files */
  ],
  note_to_client: '',
  terms: '',
  footer: ''
}

export default state
