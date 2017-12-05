import FormActions from '../base/actions'
import Company from '@/modules/documents/models/company'

export default FormActions({
  model: Company,
  repository: 'documents/repositories/company'
})
