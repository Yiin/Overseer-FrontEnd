import { mix } from 'mixwith'
import Document from '../document'
import PaymentSchema from './schema'
import PaymentMethods from './methods'
import PaymentFaker from './faker'
import BelongsToCompany from '../concerns/belongs-to-company'

/**
 * Payment model
 */
class Payment extends mix(Document).with(PaymentSchema, PaymentMethods, PaymentFaker, BelongsToCompany) {
  static create(data) {
    return new this(this.parse(data))
  }

  getTitle() {
    return this.paymentReference
  }
}

export default Payment
