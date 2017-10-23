import FormState from '../base/state'

const state = FormState('recurring_invoice', {
  fields: {
    uuid: '',

    client_uuid: '', // uuid

    // Details
    start_date: null, // YYYY-MM-DD
    end_date: null, // YYYY-MM-DD
    po_number: '',
    discount_type: 'percentage',
    discount_value: 0,
    frequency_type: 'week',
    frequency_value: 1,
    due_date: 0, // 0-31
    autobill: false,
    currency_code: 'EUR',

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

    status: 'draft'
  },

  tabs: [
    [
      'client_uuid'
    ],
    [
      'start_date',
      'end_date',
      'frequency_type',
      'frequency_value',
      'po_number',
      'autobill',
      'discount_value',
      'discount_type'
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
