import { mix } from 'mixwith'
import DocumentSchema from '../document/schema'
import { methods as CompanyRepository } from '../../repositories/company'

const EmployeeSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {

  static parse(data) {
    const UserRepository = require('../../repositories/user').methods
    const ActivityRepository = require('../../repositories/activity').methods

    return {
      ...super.parse(data),

      profilePicture: data.profile_picture,

      user: data.user && UserRepository.findOrCreate(data.user).update(data.user),
      companies: (data.companies || []).map(CompanyRepository.findByKey, CompanyRepository).filter(Boolean),

      activity: (data.activity || []).map((activity) => {
        return ActivityRepository.findOrCreate(activity, false)
      }),

      firstName: data.first_name || '',
      lastName: data.last_name || '',
      jobTitle: data.job_title || '',
      email: data.email || '',
      phone: data.phone || '',
      account: data.account || (data.user && !data.user.is_disabled ? data.user.uuid : false),
      password: data.password || '',

      /**
       * formatted formData comes from employee form ONLY.
       *
       * if it's not present, then the data most likely came from api,
       * so just simply parse api data.
       */
      formData: {
        /**
         * Does employee has all countries assigned to them?
         */
        assignAllCountries: Boolean(data.assign_all_countries || this.parseAssignAllCountries(data)),

        /**
         * If not, this is a list of country id's assigned to him.
         */
        assignedCountries: data.assigned_countries || this.parseEmployeeCountries(data),

        /**
         * Same with clients
         */
        assignAllClients: Boolean(data.assign_all_clients || this.parseAssignAllClients(data)),
        assignedClients: data.assigned_clients || this.parseEmployeeClients(data),

        /**
         * Roles are set explicitly
         */
        assignedRoles: data.assigned_roles || this.parseEmployeeRoles(data)
      }
    }
  }

  static parseAssignAllCountries(data) {
    if (!data.user) {
      return false
    }
    return data.user.assign_all_countries
  }

  static parseEmployeeCountries(data) {
    if (!data.user) {
      return []
    }
    return data.user.countries
  }

  static parseAssignAllClients(data) {
    if (!data.user) {
      return false
    }
    return data.user.assign_all_clients
  }

  static parseEmployeeClients(data) {
    if (!data.user) {
      return []
    }
    return data.user.clients
  }

  static parseEmployeeRoles(data) {
    if (!data.user) {
      return []
    }
    return data.user.roles.map((role) => role.uuid)
  }

  serialize(options = {}) {
    return {
      ...super.serialize(options),

      first_name: this.firstName,
      last_name: this.lastName,
      job_title: this.jobTitle,
      email: this.email,
      phone: this.phone,
      account: !!this.account,
      password: this.password,

      assign_all_countries: this.formData.assignAllCountries,
      assigned_countries: this.formData.assignedCountries,
      assign_all_clients: this.formData.assignAllClients,
      assigned_clients: this.formData.assignedClients,
      assigned_roles: this.formData.assignedRoles
    }
  }
}

export default EmployeeSchema
