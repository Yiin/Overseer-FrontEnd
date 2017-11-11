import faker from 'faker'
import Document from './document'
import { methods as CurrencyRepository } from '../repositories/currency'
import ProductTransformer from '../transformers/product'
import Money from './money'

/**
 * Product model
 */
export default class Product extends Document {
  static create(data) {
    return new this(this.parse(data))
  }

  /**
   * Parse product data that came from API
   */
  static parse(data) {
    const parsedData = super.parse(data)

    parsedData.name = data.name
    parsedData.identificationNumber = data.identification_number
    parsedData.description = data.description

    parsedData.isService = 'is_service' in data ? data.is_service : data.price === null
    parsedData.qty = Number(data.qty)

    const currency = CurrencyRepository.findOrDefault(data.currency)

    parsedData.currency = currency
    parsedData.price = Money.create({
      amount: data.price,
      currency
    })

    return parsedData
  }

  /**
   * Transform product properties before sending to API
   */
  static transformProps(data) {
    return ProductTransformer(data)
  }

  serialize() {
    return {
      uuid: this.uuid,
      name: this.name,
      identification_number: this.identificationNumber,
      description: this.description,
      is_service: this.isService,
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
  static fakeData() {
    return {
      name: faker.commerce.productName(),
      identification_number: faker.finance.account(),
      description: faker.lorem.paragraph(),
      qty: faker.random.number() % 100,
      price: faker.commerce.price() / 10,
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP'])
    }
  }
}
