import { uuid, id, float, text } from './data-types'

export default (product) => {
  return {
    product: {
      name: text(product.name),
      price: float(product.price),
      currency_id: id(product.currency_id),
      qty: product.is_service ? null : float(product.qty),
      tax_rate_uuid: uuid(product.tax_rate_uuid),
      description: text(product.description),
      identification_number: text(product.identification_number)
    }
  }
}
