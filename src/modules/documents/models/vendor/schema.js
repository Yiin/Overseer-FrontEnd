import { mix } from 'mixwith'
import { methods as CurrencyRepository } from '../../repositories/currency'
import DocumentSchema from '../document/schema'
import Address from '../address'
import Contact from '../contact'
import Vat from '../vat'
import Money from '../money'

const VendorSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {

  /**
   * Parse vendor data that came from API
   */
  static parse(data) {
    const parsedData = super.parse(data)

    parsedData.name = data.name
    parsedData.registrationNumber = data.registration_number
    parsedData.vat = Vat.create(data.vat_number, data.vat_number_checks)
    parsedData.website = data.website
    parsedData.email = data.email
    parsedData.address = Address.create(data)
    parsedData.contacts = (data.contacts || []).map(Contact.create, Contact)

    const currency = CurrencyRepository.findByKey(data.currency_code)
    parsedData.currency = currency
    parsedData.expenses = Money.create({
      amount: data.expenses || 0,
      currency
    })

    return parsedData
  }

  serialize(options = {}) {
    return Object.assign(super.serialize(options), {
      uuid: this.uuid,
      name: this.name,
      registration_number: this.registrationNumber,
      vat_number: this.vat.vatNumber,
      website: this.website,
      phone: this.phone,
      contacts: this.contacts.map((contact) => contact.serialize(options)),
      currency_code: (this.currency || null) && this.currency.code
    }, this.address.serialize(options))
  }
}

export default VendorSchema
