import Model from './model'
import { methods as CurrencyRepository } from '../repositories/currency'
import Money from './money'

/**
 * Discount model
 */
class Discount extends Model {
  static create(data) {
    return new Discount(Discount.parse(data))
  }

  static parse(data) {
    let modelData = {}

    if (data.type === 'flat') {
      modelData.value = Money.create({
        amount: data.value,
        currency: CurrencyRepository.findOrDefault(data.currency)
      })
    } else {
      modelData.value = Number(data.value)
    }
    modelData.type = data.type

    return modelData
  }

  serialize() {
    return {
      type: this.type,
      value: this.value instanceof Money ? this.value.amount : this.value
    }
  }
}

export default Discount
