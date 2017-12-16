import FormActions from '../base/actions'
import Expense from '@models/expense'

export default FormActions({
  model: Expense,
  repository: 'documents/repositories/expense'
})
