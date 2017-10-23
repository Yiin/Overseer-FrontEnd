import FormActions from '../base/actions'
import Payment from '@/modules/documents/models/payment'

export default FormActions({
  model: Payment,
  repository: 'documents/repositories/payment'
})
