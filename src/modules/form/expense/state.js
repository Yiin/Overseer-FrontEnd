import FormState from '@/modules/form/state'

const state = FormState({
  __name: 'expense',

  uuid: '',

  vendor_uuid: '', // uuid
  client_uuid: '', // uuid
  category_uuid: '', // uuid

  // Details
  amount: 0,
  currency_code: '', // id (currencies)
  date: null, // YYYY-MM-DD

  // Documents
  documents: [],

  tabs: [
    [
      'vendor_uuid'
    ],
    [
      'client_uuid'
    ],
    [
      'amount',
      'currency_code',
      'date'
    ],
    [
      'documents'
    ]
  ],

  errors: {}
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
