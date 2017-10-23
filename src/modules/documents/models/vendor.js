import { ArrayModel } from 'objectmodel'
import { StringNotBlank } from './common'
import { methods as CurrencyRepository } from '../repositories/currency'
import Document from './document'
import Vat from './vat'
import Address from './address'
import Currency from './currency'
import Contact from './contact'

/**
 * Vendor model
 * @type {ObjectModel}
 */
const Vendor = Document.extend({
  name: StringNotBlank,
  registration_number: [String],
  vat: [Vat],
  website: [String],
  phone: [String],
  address: [Address],
  contacts: new ArrayModel(Contact),
  currency: [Currency]
})

/**
 * Constructor
 */
Vendor.create = Document.create.bind(Vendor)

/**
 * Parse vendor data that came from API
 */
Vendor.parse = function (data) {
  const modelData = {}

  modelData.name = data.name
  modelData.registrationNumber = data.registration_number
  modelData.vat = new Vat(data.vat_number)
  modelData.website = data.website
  modelData.phone = data.phone
  modelData.address = new Address(data)
  modelData.contacts = data.contacts.map(Contact.create)
  modelData.currency = CurrencyRepository.findOrCreate(data.currency)

  return modelData
}

Vendor.prototype.serialize = function () {
  return Object.assign({
    name: this.name,
    registration_number: this.registrationNumber,
    vat_number: this.vat.vatNumber,
    website: this.website,
    phone: this.phone,
    contacts: this.contacts.map((contact) => contact.serialize),
    currency_code: this.currency.code
  }, this.address.serialize())
}

export default Vendor
