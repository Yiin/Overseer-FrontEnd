import { mix } from 'mixwith'
import moment from 'moment'
import { methods as ClientRepository } from '../../repositories/client'
import { methods as InvoiceRepository } from '../../repositories/invoice'
import { methods as CurrencyRepository } from '../../repositories/currency'
import { methods as PaymentTypeRepository } from '../../repositories/payment-type'
import Money from '../money'
import DocumentSchema from '../document/schema'

const PaymentSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {

  static parse(data) {
    const modelData = super.parse(data)

    modelData.client = ClientRepository.findByKey(data.client_uuid)
    modelData.invoice = InvoiceRepository.findByKey(data.invoice_uuid)
    modelData.paymentReference = data.payment_reference

    const currency = CurrencyRepository.findByKey(data.currency_code)

    modelData.currency = currency
    modelData.amount = Money.create({
      amount: data.amount,
      currency
    })

    modelData.refunded = Money.create({
      amount: data.refunded,
      currency
    })

    modelData.paymentType = PaymentTypeRepository.findByKey(data.payment_type_id)
    modelData.paymentDate = data.payment_date && moment(data.payment_date.date)

    return modelData
  }

  serialize(options = {}) {
    return Object.assign(super.serialize(options), {
      client_uuid: this.client.uuid,
      invoice_uuid: this.invoice.uuid,
      payment_reference: this.paymentReference,
      amount: this.amount.amount,
      currency_code: this.amount.currency.code,
      payment_type_id: this.paymentType ? this.paymentType.id : null,
      payment_date: this.paymentDate.format('YYYY-MM-DD')
    })
  }
}

export default PaymentSchema
