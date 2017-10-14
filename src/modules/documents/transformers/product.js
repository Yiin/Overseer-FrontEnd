import { uuid, currency, float, text } from './data-types'

export default (product) => {
  return {
    product: {
      name: text(product.name),
      qty: product.is_service ? null : float(product.qty),
      description: text(product.description),
      identification_number: text(product.identification_number),

      price: currency(product.price),
      currency_code: text(product.currency_code),

      tax_rate_uuid: uuid(product.tax_rate_uuid)
    }
  }
}
