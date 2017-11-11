import faker from 'faker'
import Model from './model'
import { methods as CurrencyRepository } from '../repositories/currency'
import { methods as ProductRepository } from '../repositories/product'
import Money from './money'

/**
 * BillItem model
 */
class BillItem extends Model {
  static create(data) {
    return new BillItem(BillItem.parse(data))
  }

  /**
   * Parse bill item data that came from api
   */
  static parse(data) {
    const modelData = {}

    modelData.product = ProductRepository.findByKey(data.product_uuid)
    modelData.name = data.name
    modelData.identificationNumber = data.identification_number
    modelData.cost = Money.create({
      amount: data.cost,
      currency: CurrencyRepository.findOrDefault(data.currency)
    })
    modelData.qty = data.qty

    return modelData
  }

  serialize() {
    return {
      product_uuid: (this.product || null) && this.product.uuid,
      name: this.name,
      identification_number: this.identificationNumber,
      cost: this.cost.amount,
      qty: this.qty
    }
  }

  static fakeData() {
    return {
      product_uuid: null,
      name: faker.commerce.productName(),
      identification_number: faker.finance.account(),
      cost: faker.commerce.price() % 60,
      qty: faker.random.number() % 20 + 1
    }
  }
}

export default BillItem
