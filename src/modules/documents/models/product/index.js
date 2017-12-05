import { mix } from 'mixwith'
import Document from '../document'
import BelongsToCompany from '../concerns/belongs-to-company'
import ProductSchema from './schema'
import ProductFaker from './faker'

/**
 * Product model
 */
class Product extends mix(Document).with(ProductSchema, ProductFaker, BelongsToCompany) {
  static create(data) {
    return new this(this.parse(data))
  }
}

export default Product
