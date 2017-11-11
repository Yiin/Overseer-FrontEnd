import Model from './model'
import Profile from './profile'

/**
 * Contact model
 *
 * Basically proxy to profile
 */
class Contact extends Model {
  static create(data = {}) {
    return new Contact(Contact.parse(data))
  }

  /**
   * Parse contact data that came from api
   */
  static parse(data) {
    return {
      profile: Profile.create(data)
    }
  }

  serialize() {
    return this.profile.serialize()
  }

  /**
   * Create product with random fake data.
   *
   * FOR DEBUGGING PURPOSES ONLY
   */
  static fakeData() {
    return Profile.fakeData()
  }
}

export default Contact
