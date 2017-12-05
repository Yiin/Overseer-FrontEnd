import { mix } from 'mixwith'
import store from '@/store'
import Document from '../document'
import BelongsToCompany from '../concerns/belongs-to-company'
import VendorSchema from './schema'
import VendorMethods from './methods'
import VendorFaker from './faker'

/**
 * Vendor model
 */
class Vendor extends mix(Document).with(VendorSchema, VendorMethods, VendorFaker, BelongsToCompany) {
  constructor(...props) {
    super(...props)

    /**
     * Update expenses amount for vendor
     */
    store.watch(() => {
      return store.getters['documents/repositories/expense/AVAILABLE_ITEMS'].filter((expense) => {
        return expense.vendor.uuid === this.uuid
      })
    }, (expenses) => {
      this.expenses.amount = expenses.reduce((sum, expense) => {
        return sum + expense.amount.getIn(this.expenses.currency)
      }, 0)
    })
  }

  static create(data) {
    return new this(this.parse(data))
  }
}

export default Vendor
