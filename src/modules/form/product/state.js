import {
  default as FormState,
  parseDefinition
} from '@/modules/form/state'

import Product from '@/definitions/product'

// const state = FormState({
//   __name: 'product',

//   uuid: '',

//   name: '',
//   price: 0,
//   currency_id: '', // id
//   qty: 1,
//   is_service: false,
//   tax_rate_uuid: '', // uuid
//   description: '',
//   identification_number: '',

//   images: [],

//   tabs: [
//     [
//       'name',
//       'price',
//       'currency_id',
//       'qty',
//       'tax_rate_uuid',
//       'description',
//       'identification_number'
//     ],
//     [
//       'images'
//     ]
//   ],

//   errors: {}
// })

const state = FormState(parseDefinition(Product))

state.__initial = JSON.parse(JSON.stringify(state))

export default state
