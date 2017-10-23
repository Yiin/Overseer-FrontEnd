import FormActions from '../base/actions'
import Product from '@/modules/documents/models/product'

export default FormActions({
  model: Product,
  repository: 'documents/repositories/product'
})
