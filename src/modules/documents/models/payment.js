import Document from './document'
import moment from 'moment'
import PaymentTransformer from '../transformers/payment'
import { methods as ClientRepository } from '../repositories/client'
import { methods as InvoiceRepository } from '../repositories/invoice'
import { methods as CurrencyRepository } from '../repositories/currency'
import { methods as PaymentTypeRepository } from '../repositories/payment-type'
import Money from './money'

/**
 * Payment model
 */
class Payment extends Document {
  static create(data) {
    return new this(this.parse(data))
  }

  getTitle() {
    return this.paymentReference
  }

  static parse(data) {
    const modelData = super.parse(data)

    modelData.client = ClientRepository.findByKey(data.client_uuid)
    modelData.invoice = InvoiceRepository.findByKey(data.invoice_uuid)
    modelData.paymentReference = data.payment_reference

    const currency = CurrencyRepository.find(data.currency)

    modelData.currency = currency
    modelData.amount = Money.create({
      amount: data.amount,
      currency
    })

    modelData.refunded = Money.create({
      amount: data.refunded,
      currency
    })
    modelData.paymentType = PaymentTypeRepository.find(data.payment_type)
    modelData.paymentDate = data.payment_date && moment(data.payment_date.date)

    return modelData
  }

  static transformProps(...props) {
    return PaymentTransformer(...props)
  }

  serialize() {
    return {
      uuid: this.uuid,
      client_uuid: this.client.uuid,
      invoice_uuid: this.invoice.uuid,
      payment_reference: this.paymentReference,
      amount: this.amount.amount,
      currency_code: this.amount.currency.code,
      payment_type_id: this.paymentType ? this.paymentType.id : null,
      payment_date: this.paymentDate.format('YYYY-MM-DD')
    }
  }
}

export default Payment
