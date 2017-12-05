import faker from 'faker'
import Contact from '../contact'
import Address from '../address'

const ClientFaker = (superclass) => class extends superclass {
  static fakeData() {
    return Object.assign({
      name: faker.company.companyName(),
      registration_number: faker.random.number({ min: 100000, max: 999999 }).toString(),
      vat_number: faker.random.arrayElement(['IE9700053D', 'IE6336982T', 'IE6336982T', 'IE6346967G']),
      website: faker.internet.url(),
      email: faker.internet.email(),
      contacts: Array.from({length: ((faker.random.number() % 3) + 1)}).map(Contact.fakeData),
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP']),
      language_id: 1,
      industry_id: (faker.random.number() % 55) + 1,
      company_size_id: (faker.random.number() % 6) + 1,
      payment_terms: faker.random.arrayElement([7, 14, 15, 30, 60, 90, 0])
    }, Address.fakeData())
  }
}

export default ClientFaker
