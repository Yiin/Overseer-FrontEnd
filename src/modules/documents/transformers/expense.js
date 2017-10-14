import { uuid, text, date, currency } from './data-types'

export default (expense) => {
  return {
    expense: {
      vendor_uuid: uuid(expense.vendor_uuid),
      client_uuid: uuid(expense.client_uuid),
      category_uuid: uuid(expense.category_uuid),

      amount: currency(expense.amount),
      currency_code: text(expense.currency_code),

      date: date(expense.date)
    }
  }
}
