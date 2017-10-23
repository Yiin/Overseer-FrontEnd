import { ArrayModel } from 'objectmodel'
import Document from './document'
import moment from 'moment'
import { methods as ClientRepository } from '../repositories/client'
import { methods as CurrencyRepository } from '../repositories/currency'
import Client from './client'
import Currency from './currency'
import Money from './money'
import Discount from './discount'
import BillItem from './bill-item'

/**
 * Recurring invoice model
 * @type {ObjectModel}
 */
const RecurringInvoice = Document.extend({
  client: Client,
  startDate: moment,
  endDate: moment,

  dueDate: Number,
  frequencyType: ['week', 'month', 'year'],
  frequencyValue: Number,
  autobill: Boolean,

  invoiceNumber: String,
  poNumber: [String],
  partial: Money,
  currency: Currency,
  discount: Discount,
  items: ArrayModel(BillItem),
  noteToClient: String,
  terms: String,
  footer: String,
  status: ['draft', 'pending', 'overdue', 'active']
})

/**
 * Constructor
 */
RecurringInvoice.create = Document.create.bind(RecurringInvoice)

/**
 * Parse invoice data that came from API
 */
RecurringInvoice.parse = function (data) {
  const modelData = {}

  modelData.client = ClientRepository.findOrCreate(data.client)
  modelData.startDate = moment(data.start_date.date)
  modelData.endDate = moment(data.end_date.date)

  modelData.dueDate = data.due_date
  modelData.frequencyType = data.frequency_type
  modelData.frequencyValue = data.frequency_value
  modelData.autobill = data.autobill

  modelData.invoiceNumber = data.invoice_number
  modelData.poNumber = data.po_number

  const currency = CurrencyRepository.findOrCreate(data.currency)

  modelData.currency = currency
  modelData.partial = Money.create({
    amount: data.partial,
    currency
  })

  modelData.discount = Discount.create({
    type: data.discount_type,
    value: data.discount_value
  })

  modelData.items = data.items.map(BillItem.create)

  modelData.noteToClient = data.note_to_client
  modelData.terms = data.terms
  modelData.footer = data.footer

  modelData.status = data.status

  return modelData
}

RecurringInvoice.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    client_uuid: this.client.uuid,
    start_date: this.startDate.format('YYYY-MM-DD'),
    end_date: this.endDate.format('YYYY-MM-DD'),
    due_date: this.dueDate,
    frequency_type: this.frequencyType,
    frequency_value: this.frequencyValue,
    invoice_number: this.invoiceNumber,
    po_number: this.poNumber,
    currency_code: this.currency.code,
    partial: this.partial.amount,
    discount_type: this.discount.type,
    discount_value: this.discount.value instanceof Money ? this.discount.value.amount : this.discount.value,
    items: this.items.map((item) => item.serialize()),
    note_to_client: this.noteToClient,
    terms: this.terms,
    footer: this.footer,
    status: this.status
  }
}

export default RecurringInvoice
