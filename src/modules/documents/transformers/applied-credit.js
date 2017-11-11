import { uuid, text, currency } from './data-types'

export default (item) => {
  return {
    credit_uuid: uuid(item.credit_uuid),
    amount: currency(item.amount),
    currency_code: text(item.currency_code)
  }
}
