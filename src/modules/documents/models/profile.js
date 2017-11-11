import faker from 'faker'
import Model from './model'

class Profile extends Model {
  static create(data) {
    return new Profile({
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      jobPosition: data.job_position || '',
      website: data.website || '',
      email: data.email || '',
      phone: data.phone || ''
    })
  }

  serialize() {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      job_position: this.jobPosition,
      website: this.website,
      email: this.email,
      phone: this.phone
    }
  }

  /**
   * Create profile with random fake data.
   *
   * FOR DEBUGGING PURPOSES ONLY
   */
  static fakeData() {
    return {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      job_position: faker.name.jobTitle(),
      email: faker.internet.exampleEmail(),
      phone: faker.phone.phoneNumber()
    }
  }
}

export default Profile
