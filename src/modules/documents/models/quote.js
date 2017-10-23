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
 * Quote model
 * @type {ObjectModel}
 */
const Quote = Document.extend({
  client: Client,
  quoteDate: [moment],
  dueDate: [moment],
  quoteNumber: String,
  poNumber: [String],
  partial: Money,
  currency: Currency,
  discount: Discount,
  items: ArrayModel(BillItem),
  noteToClient: [String],
  terms: [String],
  footer: [String],
  status: ['draft', 'pending', 'sent', 'viewed', 'approved', 'converted']
})

/**
 * Constructor
 */
Quote.create = Document.create.bind(Quote)

/**
 * Parse quote data that came from API
 */
Quote.parse = function (data) {
  const modelData = {}

  modelData.client = ClientRepository.findOrCreate(data.client)
  modelData.quoteDate = data.quote_date && moment(data.quote_date.date)
  modelData.dueDate = data.due_date && moment(data.due_date.date)
  modelData.quoteNumber = data.quote_number
  modelData.poNumber = data.po_number

  const currency = CurrencyRepository.findOrCreate(data.currency)

  modelData.currency = currency
  modelData.partial = Money.create({
    amount: data.partial,
    currency
  })

  modelData.discount = Discount.create({
    type: data.discount_type,
    value: data.discount_value,
    currency
  })

  modelData.items = data.items.map(BillItem.create)

  modelData.noteToClient = data.note_to_client
  modelData.terms = data.terms
  modelData.footer = data.footer

  modelData.status = data.status

  modelData.amount = Money.create({
    amount: data.amount,
    currency
  })

  return modelData
}

Quote.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    client_uuid: this.client.uuid,
    quote_date: this.quoteDate.format('YYYY-MM-DD'),
    due_date: this.dueDate.format('YYYY-MM-DD'),
    quote_number: this.quoteNumber,
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

export default Quote
