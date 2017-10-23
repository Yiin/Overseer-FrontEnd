import { ObjectModel } from 'objectmodel'
import { methods as CurrencyRepository } from '../repositories/currency'
import Money from './money'

/**
 * Discount model
 * @type {ObjectModel}
 */
const Discount = new ObjectModel({
  type: ['percentage', 'flat'],
  value: [Number, Money]
})

Discount.parse = function (data) {
  let modelData = {}

  if (data.type === 'flat') {
    modelData.value = Money.create({
      amount: data.value,
      currency: CurrencyRepository.findOrCreate(data.currency)
    })
  } else {
    modelData.value = Number(data.value)
  }
  modelData.type = data.type

  return modelData
}

Discount.create = function (data) {
  return new Discount(Discount.parse(data))
}

export default Discount
