import { uuid, id, float, text, date } from './data-types'

export default (credit) => {
  return {
    credit: {
      client_uuid: uuid(credit.client_uuid),
      amount: float(credit.amount),
      currency_id: id(credit.currency_id),

      credit_date: date(credit.credit_date),
      credit_number: text(credit.credit_number)
    }
  }
}
