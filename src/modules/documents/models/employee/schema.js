import { mix } from 'mixwith'
import DocumentSchema from '../document/schema'
// import User from '../user'
import Role from '../role'
import Permission from '../permission'
import { methods as CompanyRepository } from '../../repositories/company'

const EmployeeSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {

  static parse(data) {
    const UserRepository = require('../../repositories/user').methods

    return Object.assign(super.parse(data), {
      profilePicture: data.profile_picture,

      user: data.user && UserRepository.findOrCreate(data.user),
      companies: (data.companies || []).map(CompanyRepository.findByKey, CompanyRepository).filter(Boolean),

      firstName: data.first_name || '',
      lastName: data.last_name || '',
      jobTitle: data.job_title || '',
      email: data.email || '',
      phone: data.phone || '',
      account: data.account || (data.user && !data.user.is_disabled ? data.user.uuid : false),
      password: data.password || '',

      roles: (data.roles || []).map(Role.create, Role),
      permissions: (data.permissions || []).map(Permission.create, Permission),

      formData: {
        /**
         * data.assignedClients comes from employee form ONLY.
         *
         * if it's not present, then the data most likely came from api,
         * so just simply parse employee permissions to fetch a list of
         * clients that he manages.
         */
        assignedClients: data.assignedClients || this.getEmployeeClients(data)
      }
    })
  }

  static getEmployeeClients(data) {
    return (data.permissions || [])
      .filter((permission) => permission.scope === 'client')
      .map((permission) => permission.scope_id)
      .reduce((clients, client) => {
        if (clients.indexOf(client) < 0) {
          clients.push(client)
        }
        return clients
      }, [])
  }

  serialize(options = {}) {
    return Object.assign(super.serialize(options), {
      first_name: this.firstName,
      last_name: this.lastName,
      job_title: this.jobTitle,
      email: this.email,
      phone: this.phone,
      account: !!this.account,
      password: this.password,
      assignedClients: this.formData.assignedClients
    })
  }
}

export default EmployeeSchema
