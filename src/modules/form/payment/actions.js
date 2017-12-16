import FormActions from '../base/actions'
import Payment from '@models/payment'

export default FormActions({
  model: Payment,
  repository: 'documents/repositories/payment'
})
