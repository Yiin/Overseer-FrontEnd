import { mix } from 'mixwith'
import moment from 'moment'
import { methods as ClientRepository } from '../../repositories/client'
import { methods as CurrencyRepository } from '../../repositories/currency'
import DocumentSchema from '../document/schema'
import Money from '../money'
import Discount from '../discount'

const QuoteSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {

  /**
   * Parse quote data that came from API
   */
  static parse(data) {
    const parsedData = super.parse(data)

    parsedData.client = ClientRepository.findByKey(data.client_uuid)
    parsedData.date = data.date && moment(typeof data.date === 'object' ? data.date.date : data.date)
    parsedData.dueDate = data.due_date && moment(typeof data.due_date === 'object' ? data.due_date.date : data.due_date)
    parsedData.quoteNumber = data.quote_number
    parsedData.poNumber = data.po_number

    const currency = CurrencyRepository.findByKey(data.currency_code)

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

  serialize(options = {}) {
    return {
      ...super.serialize(options),

      client_uuid: this.client.uuid,
      date: this.date && this.date.format('YYYY-MM-DD'),
      due_date: this.dueDate && this.dueDate.format('YYYY-MM-DD'),
      quote_number: this.quoteNumber,
      po_number: this.poNumber,
      currency_code: this.currency.code,
      partial: this.partial.amount,
      discount_type: this.discount.type,
      discount_value: this.discount.value instanceof Money ? this.discount.value.amount : this.discount.value,
      applied_credits: this.appliedCredits.map((appliedCredit) => appliedCredit.serialize(options)),
      items: this.items.map((item) => item.serialize(options)),
      note_to_client: this.noteToClient,
      terms: this.terms,
      footer: this.footer,
      status: this.status
    }
  }
}

export default QuoteSchema
