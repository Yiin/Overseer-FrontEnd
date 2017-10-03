import FormState from '@/modules/form/state'

const state = FormState({
  __name: 'payment',

  uuid: '',

  client_uuid: '', // uuid
  invoice_uuid: '', // uuid

  // Details
  amount: 0,
  currency_id: null, // id (currencies)
  payment_type_id: null, // id (payment_types)
  payment_date: null, // YYYY-MM-DD
  payment_reference: '',

  tabs: [
    [
      'client_uuid'
    ],
    [
      'invoice_uuid'
    ],
    [
      'amount',
      'currency_id',
      'payment_type_id',
      'payment_date',
      'payment_reference'
    ]
  ],

  errors: {}
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
