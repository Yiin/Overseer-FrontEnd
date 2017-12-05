import FormState from '../base/state'

const state = FormState('product', {
  fields: {
    uuid: '',

    name: '',

    /**
     * If product is a service,
     * we should ignore its qty.
     */
    is_service: false,
    qty: 1,

    description: '',
    identification_number: '',

    price: '0',
    currency_code: ''
  },

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

export default state
