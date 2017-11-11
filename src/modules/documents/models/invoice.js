import faker from 'faker'
import moment from 'moment'
import store from '@/store'
import Document from './document'
import InvoiceTransformer from '../transformers/invoice'
import { methods as ClientRepository } from '../repositories/client'
import { methods as CurrencyRepository } from '../repositories/currency'
import Money from './money'
import Discount from './discount'
import BillItem from './bill-item'
import AppliedCredit from './applied-credit'
import Pdf from './pdf'
import HasPdfs from './concerns/has-pdfs'
import { mix } from 'mixwith'

/**
 * Invoice model
 */
class Invoice extends mix(Document).with(HasPdfs) {
  constructor(...data) {
    super(...data)

    /**
     * Update paid in amount for invoice
     */
    store.watch(() => {
      return store.getters['documents/repositories/payment/AA_ITEMS'].filter((payment) => {
        return payment.invoice.uuid === this.uuid
      })
    }, (payments) => {
      this.paidIn.amount = this.partial.amount + payments.reduce((sum, payment) => {
        return sum + payment.amount.getIn(this.currency)
      }, this.appliedCredits.reduce((sum, appliedCredit) => {
        return sum + appliedCredit.amount.getIn(this.currency)
      }, 0))
    })
  }

  static create(data) {
    return new this(this.parse(data))
  }

  getTitle() {
    return this.invoiceNumber
  }

  /**
   * Parse invoice data that came from API
   */
  static parse(data) {
    const parsedData = super.parse(data)

    parsedData.client = ClientRepository.findByKey(data.client_uuid)
    parsedData.invoiceDate = data.invoice_date && moment(data.invoice_date.date)
    parsedData.dueDate = data.due_date && moment(data.due_date.date)
    parsedData.invoiceNumber = data.invoice_number
    parsedData.poNumber = data.po_number

    parsedData.pdfs = (data.pdfs || []).map(Pdf.create, Pdf)
    parsedData.appliedCredits = data.applied_credits.map(AppliedCredit.create, AppliedCredit)

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

    parsedData.items = (data.items || []).map(BillItem.create, BillItem)

    parsedData.noteToClient = data.note_to_client
    parsedData.terms = data.terms
    parsedData.footer = data.footer

    parsedData.status = data.status

    parsedData.amount = Money.create({
      amount: data.amount,
      currency
    })

    parsedData.paidIn = Money.create({
      amount: data.paid_in,
      currency
    })

    return parsedData
  }

  static transformProps(...props) {
    return InvoiceTransformer(...props)
  }

  serialize() {
    return {
      uuid: this.uuid,
      client_uuid: this.client.uuid,
      invoice_date: this.invoiceDate && this.invoiceDate.format('YYYY-MM-DD'),
      due_date: this.dueDate && this.dueDate.format('YYYY-MM-DD'),
      invoice_number: this.invoiceNumber,
      po_number: this.poNumber,
      currency_code: this.currency.code,
      partial: this.partial.amount,
      discount_type: this.discount.type,
      discount_value: this.discount.value instanceof Money ? this.discount.value.amount : this.discount.value,
      applied_credits: this.appliedCredits.map((appliedCredit) => appliedCredit.serialize()),
      items: this.items.map((item) => item.serialize()),
      note_to_client: this.noteToClient,
      terms: this.terms,
      footer: this.footer,
      status: this.status
    }
  }

  static fakeData() {
    return {
      client_uuid: faker.random.arrayElement(ClientRepository.getAvailableItems().map((client) => client.uuid)),
      invoice_date: moment().format('YYYY-MM-DD'),
      due_date: faker.random.arrayElement([null, moment().add(faker.random.number() % 60, 'days').format('YYYY-MM-DD')]),
      invoice_number: faker.random.number(),
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP']),
      items: Array.from({ length: (faker.random.number() % 10) + 1 }).map(BillItem.fakeData),
      note_to_client: faker.lorem.paragraph(),
      terms: faker.lorem.sentence(),
      footer: faker.lorem.sentence()
    }
  }
}

export default Invoice
