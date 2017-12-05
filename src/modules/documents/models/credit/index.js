import { mix } from 'mixwith'
import Document from '../document'
import BelongsToCompany from '../concerns/belongs-to-company'
import CreditSchema from './schema'
import CreditMethods from './methods'
import CreditFaker from './faker'

/**
 * Credit model
 */
class Credit extends mix(Document).with(CreditSchema, CreditMethods, CreditFaker, BelongsToCompany) {
  static create(data) {
    return new this(this.parse(data))
  }

  getTitle() {
    return this.creditNumber
  }
}

export default Credit
