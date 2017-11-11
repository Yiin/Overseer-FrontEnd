import FormState from '../base/state'

const state = FormState('invoice', {
  newClientUuid: null,

  fields: {
    uuid: '',

    client_uuid: '', // uuid
    invoice_date: undefined, // YYYY-MM-DD
    due_date: undefined, // YYYY-MM-DD
    partial: 0, // partial/deposit
    currency_code: '',
    invoice_number: '',
    po_number: '',
    discount_type: 'percentage',
    discount_value: 0,

    applied_credits: [],

    items: [],

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
      'invoice_date',
      'due_date',
      'invoice_number',
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
