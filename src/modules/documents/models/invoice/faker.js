import faker from 'faker'
import moment from 'moment'
import { methods as ClientRepository } from '../../repositories/client'

const InvoiceFaker = (superclass) => class extends superclass {
  static fakeData() {
    return {
      client_uuid: faker.random.arrayElement(ClientRepository.getAvailableItems().map((client) => client.uuid)),
      invoice_date: moment().format('YYYY-MM-DD'),
      due_date: faker.random.arrayElement([null, moment().add(faker.random.number() % 60, 'days').format('YYYY-MM-DD')]),
      invoice_number: faker.random.number(),
      po_number: faker.random.number(),
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP']),
      note_to_client: faker.lorem.paragraph(),
      terms: faker.lorem.sentence(),
      footer: faker.lorem.sentence(),

      ...this.fakeItems()
    }
  }
}

export default InvoiceFaker
