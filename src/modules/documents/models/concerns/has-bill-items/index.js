import { mix } from 'mixwith'
import Schema from './schema'
import Faker from './faker'

/**
 * @mixin
 */
const HasBillItems = (superclass) =>
class extends mix(superclass).with(
  Schema,
  Faker
) {
  //
}

export default HasBillItems
