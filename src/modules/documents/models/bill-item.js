import { ObjectModel } from 'objectmodel'
import { StringNotBlank, PositiveNumber } from './common'
import { methods as CurrencyRepository } from '../repositories/currency'
import Product from './product'
import Money from './money'
import Discount from './discount'
import TaxRate from './tax-rate'

/**
 * BillItem model
 * @type {ObjectModel}
 */
const BillItem = new ObjectModel({
  product: [Product],
  name: StringNotBlank,
  cost: Money,

  qty: PositiveNumber,

  discount: [Discount],
  taxRate: [TaxRate]
})

/**
 * Constructor
 */
BillItem.create = function (data) {
  return new BillItem(BillItem.parse(data))
}

/**
 * Parse bill item data that came from api
 */
BillItem.parse = function (data) {
  const modelData = {}

  modelData.product = Product.findOrCreate(data.product)
  modelData.name = data.name
  modelData.cost = Money.create({
    amount: data.cost,
    currency: CurrencyRepository.findOrCreate(data.currency)
  })
  modelData.qty = data.qty

  return modelData
}

BillItem.prototype.serialize = function () {
  return {
    product_uuid: this.product.uuid,
    name: this.name,
    cost: this.cost.amount,
    qty: this.qty
  }
}

export default BillItem
