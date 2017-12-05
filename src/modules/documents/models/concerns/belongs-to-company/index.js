import { mix } from 'mixwith'
import BelongsToCompanySchema from './schema'

const BelongsToCompany = (superclass) =>
class extends mix(superclass).with(
  BelongsToCompanySchema
) {
  //
}

export default BelongsToCompany
