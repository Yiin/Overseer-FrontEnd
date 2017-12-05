import Model from './model'
import { methods as EmployeeRepository } from '../repositories/employee'
import { methods as ClientRepository } from '../repositories/client'
import { methods as CompanyRepository } from '../repositories/company'

class User extends Model {
  static create(data) {
    return new this(this.parse(data))
  }

  init() {
    if (this.authenticable && !this.authenticable.user) {
      this.authenticable.setUser(this)
    }
  }

  static parse(data) {
    const authenticable = {
      'employee': EmployeeRepository,
      'client': ClientRepository
    }[data.authenticable_type].findOrCreate(data.authenticable, false)

    return {
      uuid: data.uuid,

      authenticable,

      settings: data.settings,
      preferences: data.preferences,
      companies: (data.companies || []).map(CompanyRepository.findByKey),

      isDisabled: data.is_disabled
    }
  }

  getFullName() {
    return this.authenticable.getTitle()
  }

  can(action, document, scope) {
    return this.authenticable.can(action, document, scope)
  }
}

export default User
