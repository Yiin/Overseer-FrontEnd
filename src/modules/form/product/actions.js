import FormActions from '../base/actions'
import Product from '@models/product'

export default FormActions({
  model: Product,
  repository: 'documents/repositories/product'
})
