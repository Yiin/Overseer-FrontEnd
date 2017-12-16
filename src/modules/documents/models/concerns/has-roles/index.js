import { mix } from 'mixwith'
import Methods from './methods'

const HasRoles = (superclass) => class extends mix(superclass).with(Methods) {
  static parse(data) {
    const RoleRepository = require('../../../repositories/role').methods

    return {
      ...(typeof super.parse === 'function' ? super.parse(data) : {}),

      roles: (data.roles || []).map(RoleRepository.findOrCreate, RoleRepository)
    }
  }
}

export default HasRoles
