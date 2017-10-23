import { ArrayModel, FunctionModel } from 'objectmodel'
import faker from 'faker'
import { getStoreModule } from '@/store'
import Document from './document'
import { StringNotBlank } from './common'
import { methods as CurrencyRepository } from '../repositories/currency'
import { methods as LanguageRepository } from '../repositories/language'
import { methods as IndustryRepository } from '../repositories/industry'
import { methods as CompanySizeRepository } from '../repositories/company-size'
import Vat from './vat'
import Address from './address'
import Money from './money'
import Currency from './currency'
import Contact from './contact'
import Language from './language'
import Industry from './industry'
import CompanySize from './company-size'

/**
 * Client model
 * @type {ObjectModel}
 */
const Client = Document.extend({
  name: StringNotBlank,
  registrationNumber: [String],
  vat: [Vat],
  website: [String],
  phone: [String],
  address: [Address],
  contacts: [new ArrayModel(Contact)],
  currency: [Currency],
  language: [Language],
  industry: [Industry],
  companySize: [CompanySize],
  paymentTerms: [Number]
})

/**
 * Methods
 */
Client.prototype.getPrimaryEmail = FunctionModel().return(String)(
  function () {
    return this.contacts.length ? this.contacts[0].profile.email : ''
  }
)

Client.prototype.balance = FunctionModel().return(Money)(
  function () {
    return new Money({
      amount: getStoreModule(['documents', 'repositories', 'credit']).getters.AVAILABLE_ITEMS
        .filter((credit) => credit.client.uuid === this.uuid)
        .reduce((sum, credit) => {
          return sum + credit.amount.getAmountIn(this.currency)
        }, 0),
      currency: this.currency
    })
  }
)

/**
 * Constructor
 */
Client.create = Document.create.bind(Client)

/**
 * Parse client data that came from API
 */
Client.parse = function (data) {
  const modelData = {}

  modelData.name = data.name
  modelData.registrationNumber = data.registration_number
  modelData.vat = Vat.create(data.vat_number)
  modelData.website = data.website
  modelData.phone = data.phone
  modelData.address = Address.create(data)
  modelData.contacts = data.contacts.map(Contact.create)
  modelData.currency = CurrencyRepository.findOrCreate(data.currency)
  modelData.language = LanguageRepository.findOrCreate(data.language)
  modelData.industry = IndustryRepository.findOrCreate(data.industry)
  modelData.companySize = CompanySizeRepository.findOrCreate(data.company_size)
  modelData.paymentTerms = data.payment_terms
  modelData.balance = Money.create({
    amount: 0,
    currency: modelData.currency
  })

  return modelData
}

Client.prototype.serialize = function () {
  return Object.assign({
    uuid: this.uuid,
    name: this.name,
    registration_number: this.registrationNumber,
    vat_number: this.vat.vatNumber,
    website: this.website,
    phone: this.phone,
    contacts: this.contacts.map((contact) => contact.serialize),
    currency_code: this.currency.code,
    language_id: this.language.id,
    industry_id: this.industry.id,
    company_size_id: this.companySize.id,
    payment_terms: this.paymentTerms
  }, this.address.serialize())
}

/**
 * Create product with random fake data.
 *
 * FOR DEBUGGING PURPOSES ONLY
 */
Client.fakeData = function () {
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

export default Client
