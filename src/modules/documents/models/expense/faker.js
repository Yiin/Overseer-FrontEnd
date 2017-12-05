import faker from 'faker'
import { methods as VendorRepository } from '../../repositories/vendor'
import { methods as ClientRepository } from '../../repositories/client'

const ExpenseSchema = (superclass) => class extends superclass {
  static fakeData() {
    const vendors = VendorRepository.getAvailableItems()
    const clients = ClientRepository.getAvailableItems()

    const vendorIndex = vendors.length ? faker.random.number({
      min: 0,
      max: vendors.length - 1
    }) : null

    const clientIndex = clients.length ? faker.random.number({
      min: 0,
      max: clients.length - 1
    }) : null

    return {
      vendor_uuid: vendorIndex !== null ? vendors[vendorIndex] : null,
      client_uuid: clientIndex !== null ? clients[clientIndex] : null,
      amount: faker.commerce.price(),
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP'])
    }
  }
}

export default ExpenseSchema
