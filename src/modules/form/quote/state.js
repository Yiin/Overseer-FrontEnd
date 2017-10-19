import FormState from '@/modules/form/state'

const state = FormState('quote', {
  fields: {
    uuid: '',

    client_uuid: '', // uuid
    quote_date: null, // YYYY-MM-DD
    due_date: null, // YYYY-MM-DD
    partial: 0, // partial/deposit
    currency_code: '',
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

    status: 'draft'
  },

  tabs: [
    [
      'client_uuid'
    ],
    [
      'quote_date',
      'due_date',
      'quote_number',
      'po_number',
      'deposit',
      'currency_code',
      'discount_type',
      'discount_value'
    ],
    [
      'items'
    ],
    [
      'note_to_client',
      'terms',
      'footer'
    ]
  ]
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
