import { mix } from 'mixwith'
import store from '@/store'
import Document from '../document'
import BelongsToCompany from '../concerns/belongs-to-company'
import HasBillItems from '../concerns/has-bill-items'
import AppliesCredits from '../concerns/applies-credits'
import HasPdfs from '../concerns/has-pdfs'
import InvoiceFaker from './faker'
import InvoiceSchema from './schema'

/**
 * Invoice model
 */
class Invoice extends mix(Document).with(
  InvoiceSchema,
  InvoiceFaker,
  BelongsToCompany,
  HasBillItems,
  HasPdfs,
  AppliesCredits
) {
  init() {
    if (this.isHistory) {
      return
    }

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
}

export default Invoice
