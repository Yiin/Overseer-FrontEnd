import faker from 'faker'
import Model from '@models/model'
import { methods as CurrencyRepository } from '@repositories/currency'
import { methods as ProductRepository } from '@repositories/product'
import Money from '@models/money'
import Discount from '@models/discount'

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

    const currency = CurrencyRepository.findByKey(data.currency_code)

    modelData.currency = currency

    modelData.cost = Money.create({
      amount: data.cost,
      currency
    })

    modelData.discount = Discount.create({
      type: data.discount_type,
      value: data.discount_value,
      currency
    })

    modelData.qty = Number(data.qty) || 0

    return modelData
  }

  getInitialPrice() {
    return this.cost.get() * this.qty
  }

  getDiscount() {
    return this.discount.calc(this.getInitialPrice())
  }

  getDiscountedPrice() {
    return this.getInitialPrice() - this.getDiscount()
  }

  getTaxAmount() {
    return 0
  }

  getFinalPrice() {
    return this.getDiscountedPrice() + this.getTaxAmount()
  }

  serialize() {
    return {
      product_uuid: (this.product || null) && this.product.uuid,
      name: this.name,
      identification_number: this.identificationNumber,
      cost: this.cost.amount,
      discount_type: this.discount.type,
      discount_value: this.discount.amount,
      qty: this.qty
    }
  }

  static fakeData() {
    return {
      product_uuid: null,
      name: faker.commerce.productName(),
      identification_number: faker.finance.account(),
      cost: faker.commerce.price() % 60,
      qty: faker.random.number() % 20 + 1,
      discount_type: 'percentage',
      discount_value: 0
    }
  }
}

export default BillItem
