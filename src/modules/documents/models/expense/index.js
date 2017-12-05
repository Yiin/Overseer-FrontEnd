import { mix } from 'mixwith'
import Document from '../document'
import BelongsToCompany from '../concerns/belongs-to-company'
import ExpenseSchema from './schema'
import ExpenseMethods from './methods'
import ExpenseFaker from './faker'

/**
 * Expense model
 */
class Expense extends mix(Document).with(ExpenseSchema, ExpenseMethods, ExpenseFaker, BelongsToCompany) {
  static create(data) {
    return new this(this.parse(data))
  }
}

export default Expense
