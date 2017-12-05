import { mix } from 'mixwith'
import AppliesCreditsSchema from './schema'

/**
 * @mixin
 */
const AppliesCredits = (superclass) =>
class extends mix(superclass).with(
  AppliesCreditsSchema
) {
  //
}

export default AppliesCredits
