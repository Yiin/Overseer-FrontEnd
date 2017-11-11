import { id, text } from './data-types'
import vendorContact from './contact'

export default (vendor) => {
  return {
    name: text(vendor.name),
    registration_number: text(vendor.registration_number),
    vat_number: text(vendor.vat_number),
    website: text(vendor.website),
    phone: text(vendor.phone),

    address1: text(vendor.address1),
    address2: text(vendor.address2),
    city: text(vendor.city),
    postal_code: text(vendor.postal_code),
    state: text(vendor.state),
    country_id: id(vendor.country_id),

    contacts: vendor.contacts.map((contact) => vendorContact(contact)),

    currency_code: text(vendor.currency_code),
    notes: text(vendor.notes)
  }
}
