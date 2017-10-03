import { uuid, id, date, float } from './data-types'

export default (expense) => {
  return {
    expense: {
      vendor_uuid: uuid(expense.vendor_uuid),
      client_uuid: uuid(expense.client_uuid),
      category_uuid: uuid(expense.category_uuid),

      amount: float(expense.amount),
      currency_id: id(expense.currency_id),

      date: date(expense.date)
    }
  }
}
