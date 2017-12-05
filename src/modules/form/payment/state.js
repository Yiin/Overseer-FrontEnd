import FormState from '../base/state'

const state = FormState('payment', {
  newClientUuid: null,
  newInvoiceUuid: null,

  fields: {
    uuid: '',

    client_uuid: '', // uuid
    invoice_uuid: '', // uuid

    // Details
    amount: 0,
    currency_code: null, // id (currencies)
    payment_type_id: null, // id (payment_types)
    payment_date: null, // YYYY-MM-DD
    payment_reference: ''
  },

  tabs: [
    [
      'client_uuid'
    ],
    [
      'invoice_uuid'
    ],
    [
      'amount',
      'currency_code',
      'payment_type_id',
      'payment_date',
      'payment_reference',
      'applied_credits'
    ]
  ]
})

export default state
