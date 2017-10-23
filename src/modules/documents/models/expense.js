import Document from './document'
import moment from 'moment'
import { methods as VendorRepository } from '../repositories/vendor'
import { methods as ClientRepository } from '../repositories/client'
import { methods as CurrencyRepository } from '../repositories/currency'
import Vendor from './vendor'
import Client from './client'
import Money from './money'

/**
 * Expense model
 * @type {ObjectModel}
 */
const Expense = Document.extend({
  vendor: Vendor,
  client: Client,
  amount: Money,
  paymentDate: moment
})

/**
 * Constructor
 */
Expense.create = Document.create.bind(Expense)

Expense.parse = function (data) {
  const modelData = {}

  modelData.vendor = VendorRepository.findOrCreate(data.vendor)
  modelData.client = ClientRepository.findOrCreate(data.client)
  modelData.amount = Money.create({
    amount: data.amount,
    currency: CurrencyRepository.findOrCreate(data.currency)
  })
  modelData.paymentDate = data.date && moment(data.date.date)

  return modelData
}

Expense.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    vendor_uuid: this.vendor.uuid,
    client_uuid: this.client.uuid,
    amount: this.amount.amount,
    currency_code: this.amount.currency.code,
    date: this.paymentDate.format('YYYY-MM-DD')
  }
}

export default Expense
