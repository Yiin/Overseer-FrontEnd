import { ObjectModel } from 'objectmodel'
import Profile from './profile'

/**
 * Contact model
 * @type {ObjectModel}
 */
const Contact = new ObjectModel({
  profile: Profile
})

/**
 * Constructor
 */
Contact.create = function (data) {
  return new Contact(Contact.parse(data))
}

/**
 * Parse contact data that came from api
 */
Contact.parse = function (data) {
  const modelData = {}

  modelData.profile = Profile.create(data)

  return modelData
}

Contact.prototype.serialize = function () {
  return this.profile.serialize()
}

/**
 * Create product with random fake data.
 *
 * FOR DEBUGGING PURPOSES ONLY
 */
Contact.fakeData = function () {
  return Profile.fakeData()
}

export default Contact
