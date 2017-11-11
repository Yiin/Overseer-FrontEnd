import FormState from '../base/state'

const state = FormState('credit', {
  newClientUuid: null,

  fields: {
    uuid: '',

    // Client
    client_uuid: '', // uuid

    // Details
    balance: 0,
    currency_code: null, // id
    credit_date: null, // YYYY-MM-DD
    credit_number: ''
  },

  tabs: [
    [
      'client_uuid'
    ],
    [
      'balance',
      'currency_code',
      'credit_date',
      'credit_number'
    ]
  ],

  errors: {}
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
