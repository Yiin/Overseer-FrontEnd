import { mix } from 'mixwith'
import DocumentSchema from '../document/schema'
import { methods as CurrencyRepository } from '../../repositories/currency'
import Money from '../money'

const ProductSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {
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

    const currency = CurrencyRepository.findByKey(data.currency_code)

    parsedData.currency = currency
    parsedData.price = Money.create({
      amount: data.price,
      currency
    })

    return parsedData
  }

  serialize(options = {}) {
    return {
      ...super.serialize(options),

      name: this.name,
      identification_number: this.identificationNumber,
      description: this.description,
      is_service: this.isService,
      qty: this.isService ? null : this.qty,
      price: this.price.amount,
      currency_code: this.price.currency.code
    }
  }
}

export default ProductSchema
