import { mix } from 'mixwith'
import Document from '../document'
import HasBillItems from '../concerns/has-bill-items'
import AppliesCredits from '../concerns/applies-credits'
import HasPdfs from '../concerns/has-pdfs'
import BelongsToCompany from '../concerns/belongs-to-company'
import QuoteSchema from './schema'
import QuoteMethods from './methods'
import QuoteFaker from './faker'

/**
 * Quote model
 */
class Quote extends mix(Document).with(
  QuoteSchema,
  QuoteMethods,
  QuoteFaker,
  HasBillItems,
  HasPdfs,
  AppliesCredits,
  BelongsToCompany
) {
  static create(data) {
    return new this(this.parse(data))
  }

  getTitle() {
    return this.quoteNumber
  }
}

export default Quote
