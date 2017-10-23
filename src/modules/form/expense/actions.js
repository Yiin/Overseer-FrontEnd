import FormActions from '../base/actions'
import Expense from '@/modules/documents/models/expense'

export default FormActions({
  model: Expense,
  repository: 'documents/repositories/expense'
})
