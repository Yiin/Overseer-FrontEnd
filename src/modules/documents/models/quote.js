import Document from './document'
import moment from 'moment'
import { mix } from 'mixwith'
import QuoteTransformer from '../transformers/quote'
import { methods as ClientRepository } from '../repositories/client'
import { methods as CurrencyRepository } from '../repositories/currency'
import Money from './money'
import Discount from './discount'
import BillItem from './bill-item'
import Pdf from './pdf'
import HasPdfs from './concerns/has-pdfs'

/**
 * Quote model
 */
class Quote extends mix(Document).with(HasPdfs) {
  static create(data) {
    return new this(this.parse(data))
  }

  getTitle() {
    return this.quoteNumber
  }

  /**
   * Parse quote data that came from API
   */
  static parse(data) {
    const parsedData = super.parse(data)

    parsedData.client = ClientRepository.findByKey(data.client_uuid)
    parsedData.quoteDate = data.quote_date && moment(data.quote_date.date)
    parsedData.dueDate = data.due_date && moment(data.due_date.date)
    parsedData.quoteNumber = data.quote_number
    parsedData.poNumber = data.po_number

    const currency = CurrencyRepository.find(data.currency)

    parsedData.currency = currency
    parsedData.partial = Money.create({
      amount: data.partial,
      currency
    })

    parsedData.discount = Discount.create({
      type: data.discount_type,
      value: data.discount_value,
      currency
    })

    parsedData.pdfs = data.pdfs.map(Pdf.create, Pdf)
    parsedData.items = (data.items || []).map(BillItem.create, BillItem)

    parsedData.noteToClient = data.note_to_client
    parsedData.terms = data.terms
    parsedData.footer = data.footer

    parsedData.status = data.status

    parsedData.amount = Money.create({
      amount: data.amount,
      currency
    })

    return parsedData
  }

  static transformProps(...props) {
    return QuoteTransformer(...props)
  }

  serialize() {
    return {
      uuid: this.uuid,
      client_uuid: this.client.uuid,
      quote_date: this.quoteDate && this.quoteDate.format('YYYY-MM-DD'),
      due_date: this.dueDate && this.dueDate.format('YYYY-MM-DD'),
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
}

export default Quote
