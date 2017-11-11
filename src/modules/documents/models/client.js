import faker from 'faker'
import store from '@/store'
import Document from './document'
import ClientTransformer from '../transformers/client'
import { methods as CurrencyRepository } from '../repositories/currency'
import { methods as LanguageRepository } from '../repositories/language'
import { methods as IndustryRepository } from '../repositories/industry'
import { methods as CompanySizeRepository } from '../repositories/company-size'
import Vat from './vat'
import Address from './address'
import Money from './money'
import Contact from './contact'

/**
 * Client model
 */
class Client extends Document {
  constructor(data) {
    super(data)

    store.watch(() => store.getters['documents/repositories/credit/AVAILABLE_ITEMS'].filter((credit) => {
      return credit.client.uuid === this.uuid
    }), this.updateBalance.bind(this))

    store.watch(() => store.getters['documents/repositories/invoice/AVAILABLE_ITEMS'].filter((invoice) => {
      return invoice.client.uuid === this.uuid
    }), this.updateBalance.bind(this))
  }

  static create(data) {
    return new this(this.parse(data))
  }

  getPrimaryEmail() {
    return this.contacts.length ? this.contacts[0].profile.email || '' : ''
  }

  credits() {
    return store.getters['documents/repositories/credit/AA_ITEMS'].filter((credit) => {
      return credit.client.uuid === this.uuid
    })
  }

  invoices() {
    return store.getters['documents/repositories/invoice/AA_ITEMS'].filter((invoice) => {
      return invoice.client.uuid === this.uuid
    })
  }

  updateBalance() {
    this.balance.amount = this.credits().reduce((sum, credit) => {
      return sum + credit.balance.getIn(this.currency)
    }, this.invoices().reduce((sum, invoice) => {
      return sum + (invoice.amount.getIn(this.currency) - invoice.paidIn.getIn(this.currency))
    }, 0))
  }

  /**
   * Parse client data that came from API
   */
  static parse(data) {
    const modelData = super.parse(data)

    modelData.name = data.name
    modelData.registrationNumber = data.registration_number
    modelData.vat = Vat.create(data.vat_number, data.vat_number_checks)
    modelData.website = data.website
    modelData.phone = data.phone
    modelData.address = Address.create(data)
    modelData.contacts = (data.contacts || []).map(Contact.create, Contact)
    modelData.currency = CurrencyRepository.findOrDefault(data.currency)
    modelData.language = LanguageRepository.find(data.language)
    modelData.industry = IndustryRepository.find(data.industry)
    modelData.companySize = CompanySizeRepository.find(data.company_size)
    modelData.paymentTerms = data.payment_terms
    modelData.balance = Money.create({
      amount: 0,
      currency: modelData.currency
    })

    return modelData
  }

  static transformProps(data) {
    return ClientTransformer(data)
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
      currency_code: (this.currency || null) && this.currency.code,
      language_id: (this.language || null) && this.language.id,
      industry_id: (this.industry || null) && this.industry.id,
      company_size_id: (this.companySize || null) && this.companySize.id,
      payment_terms: this.paymentTerms
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
      vat_number: faker.random.arrayElement(['IE9700053D', 'IE6336982T', 'IE6336982T', 'IE6346967G']),
      website: faker.internet.url(),
      phone: faker.phone.phoneNumber(),
      contacts: Array.from({length: ((faker.random.number() % 3) + 1)}).map(Contact.fakeData),
      currency_code: faker.random.arrayElement(['EUR', 'USD', 'GBP']),
      language_id: 1,
      industry_id: (faker.random.number() % 55) + 1,
      company_size_id: (faker.random.number() % 6) + 1,
      payment_terms: faker.random.arrayElement([7, 14, 15, 30, 60, 90, 0])
    }, Address.fakeData())
  }
}

export default Client
