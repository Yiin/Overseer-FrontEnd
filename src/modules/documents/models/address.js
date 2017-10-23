import { ObjectModel } from 'objectmodel'
import faker from 'faker'
import { methods as CountryRepository } from '../repositories/country'
import Country from './country'

const Address = new ObjectModel({
  country: [Country],
  state: [String],
  city: [String],
  postalCode: [String],
  address1: [String],
  address2: [String]
})

Address.create = function (data) {
  return new Address({
    country: CountryRepository.findOrCreate(data.country),
    state: data.state,
    city: data.city,
    postalCode: data.postal_code,
    address1: data.address1,
    address2: data.address2
  })
}

Address.prototype.serialize = function () {
  return {
    country_id: this.country,
    state: this.state,
    city: this.city,
    postal_code: this.postalCode,
    address1: this.address1,
    address2: this.address2
  }
}

/**
 * Create profile with random fake data.
 *
 * FOR DEBUGGING PURPOSES ONLY
 */
Address.fakeData = function () {
  return {
    country_id: (faker.random.number() % 249) + 1,
    state: faker.address.county(),
    city: faker.address.city(),
    postal_code: faker.address.zipCode(),
    address1: faker.address.streetAddress(),
    address2: faker.address.secondaryAddress()
  }
}

export default Address
