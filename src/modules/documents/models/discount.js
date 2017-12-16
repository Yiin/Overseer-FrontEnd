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
        currency: CurrencyRepository.findByKey(data.currency.code)
      })
    } else {
      modelData.value = Number(data.value) || 0
    }
    modelData.type = data.type

    return modelData
  }

  get amount() {
    return this.value instanceof Money ? this.value.amount : this.value
  }

  calc(amount) {
    if (this.type === 'flat') {
      return this.value
    } else {
      return this.amount * amount / 100
    }
  }

  serialize() {
    return {
      type: this.type,
      value: this.amount
    }
  }
}

export default Discount
