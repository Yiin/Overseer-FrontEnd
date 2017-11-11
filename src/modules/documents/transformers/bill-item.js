import { uuid, text, float } from './data-types'

export default (item) => {
  return {
    product_uuid: uuid(item.product_uuid || ((item.product || null) && item.product.uuid), null),
    name: text(item.name),
    identification_number: text(item.identification_number || item.identificationNumber),
    cost: float(item.price || item.cost),
    qty: float(item.qty),
    discount: float(item.discount),
    tax_rate_uuid: null
  }
}
