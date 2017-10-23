import FormState from '../base/state'

const state = FormState('payment', {
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
      'payment_reference'
    ]
  ]
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
