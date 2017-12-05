import { mix } from 'mixwith'
import Schema from './schema'
import Methods from './methods'

/**
 * @mixin
 */
const HasPdfs = (superclass) => class extends mix(superclass).with(Schema, Methods) {
  //
}

export default HasPdfs
