import { mix } from 'mixwith'
import DocumentSchema from '../document/schema'
import Vat from '../vat'
import Address from '../address'
import Contact from '../contact'
import Money from '../money'
import { methods as CurrencyRepository } from '../../repositories/currency'
import { methods as LanguageRepository } from '../../repositories/language'
import { methods as IndustryRepository } from '../../repositories/industry'
import { methods as CompanySizeRepository } from '../../repositories/company-size'

const ClientSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {

  /**
   * Parse client data that came from API
   */
  static parse(data) {
    const modelData = super.parse(data)

    modelData.name = data.name
    modelData.registrationNumber = data.registration_number
    modelData.vat = Vat.create(data.vat_number, data.vat_number_checks)
    modelData.website = data.website
    modelData.email = data.email
    modelData.phone = data.phone
    modelData.address = Address.create(data)
    modelData.contacts = (data.contacts || []).map(Contact.create, Contact)
    modelData.currency = CurrencyRepository.findByKey(data.currency_code)
    modelData.language = LanguageRepository.findByKey(data.language_id)
    modelData.industry = IndustryRepository.findByKey(data.industry_id)
    modelData.companySize = CompanySizeRepository.findByKey(data.company_size_id)
    modelData.paymentTerms = data.payment_terms
    modelData.balance = Money.create({
      amount: 0,
      currency: modelData.currency
    })

    return modelData
  }

  /**
   * Serialize model data for forms filling or API requests
   */
  serialize(options = {}) {
    return {
      ...super.serialize(options),

      name: this.name,
      registration_number: this.registrationNumber,
      vat_number: this.vat.vatNumber,
      website: this.website,
      email: this.email,
      contacts: this.contacts.map((contact) => contact.serialize(options)),
      currency_code: (this.currency || null) && this.currency.code,
      language_id: (this.language || null) && this.language.id,
      industry_id: (this.industry || null) && this.industry.id,
      company_size_id: (this.companySize || null) && this.companySize.id,
      payment_terms: this.paymentTerms,

      ...this.address.serialize(options)
    }
  }
}

export default ClientSchema
