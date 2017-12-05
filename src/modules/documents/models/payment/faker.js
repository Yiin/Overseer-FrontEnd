import faker from 'faker'
import { methods as ClientRepository } from '../../repositories/client'
import { methods as PaymentTypeRepository } from '../../repositories/payment-type'

const PaymentFaker = (superclass) => class extends superclass {
  static fakeData() {
    const clients = ClientRepository.getActiveCompanyItems()

    let client = null
    let invoice = null

    if (clients.length) {
      client = faker.random.arrayElement(clients)

      if (client.invoices().length) {
        invoice = faker.random.arrayElement(client.invoices())
      }
    }

    return {
      client_uuid: client && client.uuid,
      invoice_uuid: invoice && invoice.uuid,
      payment_reference: '#' + faker.random.number(),
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP']),
      amount: faker.commerce.price() % 200,
      payment_type_id: faker.random.arrayElement(PaymentTypeRepository.getActiveItems()).id
    }
  }
}

export default PaymentFaker
