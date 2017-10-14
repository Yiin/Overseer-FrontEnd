import FormState from '@/modules/form/state'

const state = FormState('product', {
  uuid: '',

  name: '',
  qty: 1,
  description: '',
  identification_number: '',

  price: '',
  currency_code: '',
  tax_rate_uuid: '',

  is_service: false,

  images: [],

  tabs: [
    [
      'name',
      'qty',
      'description',
      'identification_number',
      'price',
      'currency_code',
      'tax_rate_uuid'
    ],
    [
      'images'
    ]
  ]
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
