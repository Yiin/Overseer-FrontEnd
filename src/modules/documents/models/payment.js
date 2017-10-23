import Document from './document'
import moment from 'moment'
import { methods as ClientRepository } from '../repositories/client'
import { methods as InvoiceRepository } from '../repositories/invoice'
import { methods as CurrencyRepository } from '../repositories/currency'
import { methods as PaymentTypeRepository } from '../repositories/payment-type'
import Client from './client'
import Invoice from './invoice'
import Money from './money'
import PaymentType from './payment-type'

/**
 * Payment model
 * @type {ObjectModel}
 */
const Payment = Document.extend({
  client: Client,
  invoice: Invoice,
  paymentReference: [String],
  amount: Money,
  paymentType: PaymentType,
  paymentDate: moment
})

/**
 * Constructor
 */
Payment.create = Document.create.bind(Payment)

Payment.parse = function (data) {
  const modelData = {}

  modelData.client = ClientRepository.findOrCreate(data.client)
  modelData.invoice = InvoiceRepository.findOrCreate(data.invoice)
  modelData.paymentReference = data.payment_reference
  modelData.amount = Money.create({
    amount: data.amount,
    currency: CurrencyRepository.findOrCreate(data.currency)
  })
  modelData.paymentType = PaymentTypeRepository.findOrCreate(data.payment_type)
  modelData.paymentDate = data.payment_date && moment(data.payment_date.date)

  return modelData
}

Payment.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    client_uuid: this.client.uuid,
    invoice_uuid: this.invoice.uuid,
    payment_reference: this.paymentReference,
    amount: this.amount.amount,
    currency_code: this.amount.currency.code,
    payment_type_id: this.paymentType.id,
    payment_date: this.paymentDate.format('YYYY-MM-DD')
  }
}

export default Payment
