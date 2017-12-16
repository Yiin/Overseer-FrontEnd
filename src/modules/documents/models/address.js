import faker from 'faker'
import Model from './model'
import { methods as CountryRepository } from '../repositories/country'

class Address extends Model {
  static create(data) {
    return new Address({
      country: CountryRepository.findByKey(data.country_id),
      state: data.state,
      city: data.city,
      postalCode: data.postal_code,
      address1: data.address1,
      address2: data.address2
    })
  }

  serialize() {
    return {
      country_id: (this.country || null) && this.country.id,
      state: this.state,
      city: this.city,
      postal_code: this.postalCode,
      address1: this.address1,
      address2: this.address2
    }
  }

  format() {
    return `${this.address1} ${this.address2} ${this.postalCode}, ${this.city}, ${this.country.name}`
  }

  /**
   * Create profile with random fake data.
   *
   * FOR DEBUGGING PURPOSES ONLY
   */
  static fakeData() {
    return {
      country_id: (faker.random.number() % 249) + 1,
      state: faker.address.county(),
      city: faker.address.city(),
      postal_code: faker.address.zipCode(),
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress()
    }
  }
}

export default Address
