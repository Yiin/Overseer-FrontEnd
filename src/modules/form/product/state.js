import FormState from '../base/state'

const state = FormState('product', {
  fields: {
    uuid: '',

    name: '',
    qty: 1,
    description: '',
    identification_number: '',

    price: '',
    currency_code: ''
  },

  /**
   * If product is a service,
   * we should ignore its qty.
   */
  is_service: false,

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
