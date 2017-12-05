import User from './user'
import { methods as CompanyRepository } from '../repositories/company'

class AuthUser extends User {
  static parse(data) {
    return Object.assign(super.parse(data), {
      company: data.state && data.state.company_uuid
        ? CompanyRepository.find(data.state.company_uuid)
        : CompanyRepository.first()
    })
  }
}

export default AuthUser
