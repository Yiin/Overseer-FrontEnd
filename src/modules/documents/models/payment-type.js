import { ObjectModel } from 'objectmodel'

/**
 * PaymentType model
 * @type {ObjectModel}
 */
const PaymentType = new ObjectModel({
  id: Number,
  name: String
})

PaymentType.create = function (data) {
  return new PaymentType({
    id: data.id,
    name: data.name
  })
}

export default PaymentType
