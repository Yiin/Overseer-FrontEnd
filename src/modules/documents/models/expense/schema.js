import { mix } from 'mixwith'
import moment from 'moment'
import DocumentSchema from '../document/schema'
import { methods as VendorRepository } from '../../repositories/vendor'
import { methods as ClientRepository } from '../../repositories/client'
import { methods as InvoiceRepository } from '../../repositories/invoice'
import { methods as CurrencyRepository } from '../../repositories/currency'
import Money from '../money'

const ExpenseSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {
  static parse(data) {
    const modelData = super.parse(data)

    modelData.vendor = VendorRepository.findByKey(data.vendor_uuid)
    modelData.client = ClientRepository.findByKey(data.client_uuid)

    const currency = CurrencyRepository.findByKey(data.currency_code)
    modelData.currency = currency
    modelData.amount = Money.create({
      amount: data.amount,
      currency
    })
    modelData.date = data.date && moment(data.date.date)
    modelData.invoice = InvoiceRepository.findByKey(data.invoice_uuid)

    return modelData
  }

  serialize(options = {}) {
    return {
      ...super.serialize(options),

      vendor_uuid: this.vendor.uuid,
      client_uuid: this.client.uuid,
      amount: this.amount.amount,
      currency_code: this.amount.currency.code,
      date: this.date.format('YYYY-MM-DD')
    }
  }
}

export default ExpenseSchema
