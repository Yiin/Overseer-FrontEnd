import { uuid, id, date, float, text } from './data-types'

export default (payment) => {
  return {
    payment: {
      client_uuid: uuid(payment.client_uuid),
      invoice_uuid: uuid(payment.invoice_uuid),

      amount: float(payment.amount),
      currency_id: id(payment.currency_id),
      payment_type_id: id(payment.payment_type_id),
      payment_date: date(payment.payment_date),
      payment_reference: text(payment.payment_reference)
    }
  }
}
