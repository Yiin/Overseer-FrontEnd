import _ from 'lodash'
import { mix } from 'mixwith'
import store from '@/store'
import Document from '../document'
import BelongsToCompany from '../concerns/belongs-to-company'
import EmployeeSchema from './schema'
import EmployeeMethods from './methods'
import EmployeeFaker from './faker'

const preloadedProfilePictures = []

class Employee extends mix(Document).with(EmployeeSchema, EmployeeMethods, EmployeeFaker, BelongsToCompany) {
  static create(data) {
    return new this(this.parse(data))
  }

  init() {
    // preload profile picture
    if (this.profilePicture && preloadedProfilePictures.indexOf(this.profilePicture) < 0) {
      preloadedProfilePictures.push(this.profilePicture)

      console.log('preloadeProfilePicture', this.profilePicture)

      ;(new Image()).src = this.profilePicture
    }
  }

  update(...args) {
    const previous = _.cloneDeep(this)

    super.update(...args)

    /**
     * If we were updated, check for changed permissions
     * and update accessible documents list accordingly.
     */
    if (store.state.auth.user.uuid === this.user.uuid) {
      store.dispatch('auth/SET_USER', args[0].user)

      this.updateDocuments(previous)
    }
  }

  getTitle() {
    return `${this.firstName} ${this.lastName}`
  }
}

export default Employee
