import { mix } from 'mixwith'
import Model from '../model'
import HasRoles from '../concerns/has-roles'
import { methods as CompanyRepository } from '../../repositories/company'
import UserMethods from './methods'

class User extends mix(Model).with(UserMethods, HasRoles) {
  static create(data) {
    return new this(this.parse(data))
  }

  static parse(data) {
    return {
      ...super.parse(data),

      uuid: data.uuid,

      authenticableType: data.authenticable_type,
      authenticableId: data.authenticable_id,

      companies: (data.companies || []).map(CompanyRepository.findByKey).filter(Boolean),
      assignedCountries: data.countries || [],
      assignedClients: data.clients || [],

      assignAllCountries: data.assign_all_countries,
      assignAllClients: data.assign_all_clients,

      isDisabled: data.is_disabled
    }
  }
}

export default User
