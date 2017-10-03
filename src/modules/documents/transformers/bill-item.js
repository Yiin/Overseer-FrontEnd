import { uuid, text, float } from './data-types'

export default (item) => {
  return {
    product_uuid: uuid(item.product_uuid, null),
    product_name: text(item.product_name),
    cost: float(item.price || item.cost),
    qty: float(item.qty),
    discount: float(item.discount),
    tax_rate_uuid: uuid(item.tax_rate_uuid || item.tax_rate ? item.tax_rate.uuid : false || item.taxRate ? item.taxRate.uuid : null)
  }
}
