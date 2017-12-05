import faker from 'faker'
import { methods as ClientRepository } from '../../repositories/client'

const CreditFaker = (superclass) => class extends superclass {
  static fakeData() {
    return {
      client_uuid: faker.random.arrayElement(ClientRepository.getAvailableItems().map((client) => client.uuid)),
      balance: (faker.commerce.price() % 30) * 10,
      credit_number: faker.random.number(),
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP'])
    }
  }
}

export default CreditFaker
