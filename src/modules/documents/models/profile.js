import { ObjectModel } from 'objectmodel'
import faker from 'faker'

const Profile = new ObjectModel({
  firstName: [String],
  lastName: [String],
  jobPosition: [String],
  website: [String],
  email: [String],
  phone: [String]
})

Profile.create = function (data) {
  return new Profile({
    firstName: data.first_name,
    lastName: data.last_name,
    jobPosition: data.job_position,
    website: data.website,
    email: data.email,
    phone: data.phone
  })
}

Profile.prototype.serialize = function () {
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
Profile.fakeData = function () {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    job_position: faker.name.jobTitle(),
    email: faker.internet.exampleEmail(),
    phone: faker.phone.phoneNumber()
  }
}

export default Profile
