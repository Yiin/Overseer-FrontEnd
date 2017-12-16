import { mix } from 'mixwith'
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

      ;(new Image()).src = this.profilePicture
    }
  }

  getTitle() {
    return `${this.firstName} ${this.lastName}`
  }
}

export default Employee
