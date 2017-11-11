import faker from 'faker'
import store from '@/store'
import VendorTransformer from '../transformers/vendor'
import { methods as CurrencyRepository } from '../repositories/currency'
import Document from './document'
import Vat from './vat'
import Address from './address'
import Money from './money'
import Contact from './contact'

/**
 * Vendor model
 */
class Vendor extends Document {
  constructor(...props) {
    super(...props)

    /**
     * Update expenses amount for vendor
     */
    store.watch(() => {
      return store.getters['documents/repositories/expense/AVAILABLE_ITEMS'].filter((expense) => {
        return expense.vendor.uuid === this.uuid
      })
    }, (expenses) => {
      this.expenses.amount = expenses.reduce((sum, expense) => {
        return sum + expense.amount.getIn(this.expenses.currency)
      }, 0)
    })
  }

  static create(data) {
    return new this(this.parse(data))
  }

  getPrimaryEmail() {
    return this.contacts.length ? this.contacts[0].profile.email || '' : ''
  }

  /**
   * Parse vendor data that came from API
   */
  static parse(data) {
    const parsedData = super.parse(data)

    parsedData.name = data.name
    parsedData.registrationNumber = data.registration_number
    parsedData.vat = Vat.create(data.vat_number, data.vat_number_checks)
    parsedData.website = data.website
    parsedData.phone = data.phone
    parsedData.address = Address.create(data)
    parsedData.contacts = (data.contacts || []).map(Contact.create, Contact)

    const currency = CurrencyRepository.findOrDefault(data.currency)
    parsedData.currency = currency
    parsedData.expenses = Money.create({
      amount: data.expenses || 0,
      currency
    })

    return parsedData
  }

  static transformProps(...props) {
    return VendorTransformer(...props)
  }

  serialize() {
    return Object.assign({
      uuid: this.uuid,
      name: this.name,
      registration_number: this.registrationNumber,
      vat_number: this.vat.vatNumber,
      website: this.website,
      phone: this.phone,
      contacts: this.contacts.map((contact) => contact.serialize()),
      currency_code: (this.currency || null) && this.currency.code
    }, this.address.serialize())
  }

  /**
   * Create product with random fake data.
   *
   * FOR DEBUGGING PURPOSES ONLY
   */
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

export default Vendor
