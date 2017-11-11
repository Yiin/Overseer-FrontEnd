import { uuid, currency, text, date } from './data-types'

export default (credit) => {
  return {
    client_uuid: uuid(credit.client_uuid),
    balance: currency(credit.balance),
    currency_code: text(credit.currency_code),

    credit_date: date(credit.credit_date),
    credit_number: text(credit.credit_number)
  }
}
