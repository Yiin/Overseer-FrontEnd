import { uuid, id, date, currency, text } from './data-types'

export default (payment) => {
  return {
    payment: {
      client_uuid: uuid(payment.client_uuid),
      invoice_uuid: uuid(payment.invoice_uuid),

      amount: currency(payment.amount),
      currency_code: text(payment.currency_code),
      payment_type_id: id(payment.payment_type_id),
      payment_date: date(payment.payment_date),
      payment_reference: text(payment.payment_reference)
    }
  }
}
