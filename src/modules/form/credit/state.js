import FormState from '@/modules/form/state'

const state = FormState({
  __name: 'credit',

  uuid: '',

  // Client
  client_uuid: '', // uuid

  // Details
  amount: 0,
  currency_code: null, // id
  credit_date: null, // YYYY-MM-DD
  credit_number: '',

  tabs: [
    [
      'client_uuid'
    ],
    [
      'amount',
      'currency_code',
      'credit_date',
      'credit_number'
    ]
  ],

  errors: {}
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
