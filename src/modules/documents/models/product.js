import faker from 'faker'
import Document from './document'
import { StringNotBlank } from './common'
import { methods as CurrencyRepository } from '../repositories/currency'
import Money from './money'

/**
 * Product model
 * @type {ObjectModel}
 */
const Product = Document.extend({
  name: StringNotBlank,
  identificationNumber: [String],
  description: [String],

  // if product is a service, it has no quantity
  isService: Boolean,
  qty: [Number],

  // Price of the product
  price: Money
}).defaults({
  isService: false
})

/**
 * Constructor
 */
Product.create = Document.create.bind(Product)

/**
 * Parse product data that came from API
 *
 * Used in constructor
 */
Product.parse = function (data) {
  const modelData = {}

  modelData.name = data.name
  modelData.identificationNumber = data.identification_number
  modelData.description = data.description

  modelData.isService = data.qty === null
  modelData.qty = data.qty

  modelData.price = Money.create({
    amount: data.price,
    currency: CurrencyRepository.findOrCreate(data.currency)
  })

  return modelData
}

Product.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    identification_number: this.identificationNumber,
    description: this.description,
    qty: this.isService ? null : this.qty,
    price: this.price.amount,
    currency_code: this.price.currency.code
  }
}

/**
 * Create product with random fake data.
 *
 * FOR DEBUGGING PURPOSES ONLY
 */
Product.fakeData = function () {
  return {
    name: faker.commerce.productName(),
    identification_number: faker.finance.account(),
    description: faker.lorem.paragraph(),
    qty: faker.random.number() % 100,
    price: faker.commerce.price() / 10,
    currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP'])
  }
}

export default Product
