import { id, text } from './data-types'
import clientContact from './contact'

export default (client) => {
  return {
    client: {
      name: text(client.name),
      registration_number: text(client.registration_number),
      vat_number: text(client.vat_number),
      website: text(client.website),
      phone: text(client.phone),

      address1: text(client.address1),
      address2: text(client.address2),
      city: text(client.city),
      postal_code: text(client.postal_code),
      state: text(client.state),
      country_id: id(client.country_id),

      contacts: client.contacts.map((contact) => clientContact(contact)),

      currency_id: id(client.currency_id),
      language_id: id(client.language_id),
      payment_terms: id(client.payment_terms),
      company_size_id: id(client.company_size_id),
      industry_id: id(client.industry_id)
    }
  }
}
