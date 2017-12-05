import faker from 'faker'
import Model from './model'

/**
 * Contact model
 *
 * Basically proxy to profile
 */
class Contact extends Model {
  static create(data = {}) {
    return new this(this.parse(data))
  }

  /**
   * Parse contact data that came from api
   */
  static parse(data) {
    return {
      uuid: data.uuid || '',
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      jobTitle: data.job_title || '',
      email: data.email || '',
      website: data.website || '',
      phone: data.phone || ''
    }
  }

  serialize(options = {}) {
    return {
      uuid: options.fresh ? null : this.uuid,
      first_name: this.firstName,
      last_name: this.lastName,
      job_title: this.jobTitle,
      website: this.website,
      email: this.email,
      phone: this.phone
    }
  }

  /**
   * Create product with random fake data.
   *
   * FOR DEBUGGING PURPOSES ONLY
   */
  static fakeData() {
    return {
      uuid: '',
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      job_title: faker.name.jobTitle(),
      email: faker.internet.exampleEmail(),
      phone: faker.phone.phoneNumber(),
      website: faker.internet.url()
    }
  }
}

export default Contact
