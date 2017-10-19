import {
  required
} from '@/modules/form/validators'

export default (product) => {
  return {
    product_name: [].concat(
      required(product.product_name, 'You must specify product name.')
    )
  }
}
