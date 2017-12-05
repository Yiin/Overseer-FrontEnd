import faker from 'faker'
import Address from '../address'
import Contact from '../contact'

const VendorFaker = (superclass) => class extends superclass {

  static fakeData() {
    return Object.assign({
      name: faker.company.companyName(),
      registration_number: faker.random.number({ min: 100000, max: 999999 }).toString(),
      vat_number: faker.random.arrayElement(['IE9700053D', 'IE1234567A', 'IE6336982T', 'IE6336982T', 'IE6346967G']),
      website: faker.internet.url(),
      phone: faker.phone.phoneNumber(),
      contacts: Array.from({length: ((faker.random.number() % 3) + 1)}).map(Contact.fakeData),
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP'])
    }, Address.fakeData())
  }
}

export default VendorFaker
