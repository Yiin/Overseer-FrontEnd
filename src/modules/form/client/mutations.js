import * as mutations from './mutation-types'

export default {
  [mutations.SET_ERRORS](state, errors) {
    state.errors = errors
  },

  [mutations.SET_NAME](state, name) {
    state.name = name
  },

  [mutations.SET_REGISTRATION_NUMBER](state, registrationNumber) {
    state.registration_number = registrationNumber
  },

  [mutations.SET_VAT_NUMBER](state, vatNumber) {
    state.vat_number = vatNumber
  },

  [mutations.SET_WEBSITE](state, website) {
    state.website = website
  },

  [mutations.SET_PHONE](state, phone) {
    state.phone = phone
  },

  [mutations.SET_LOGO](state, logo) {
    state.logo = logo
  },

  [mutations.SET_ADDRESS1](state, address1) {
    state.address1 = address1
  },

  [mutations.SET_ADDRESS2](state, address2) {
    state.address2 = address2
  },

  [mutations.SET_CITY](state, city) {
    state.city = city
  },

  [mutations.SET_POSTAL_CODE](state, postalCode) {
    state.postal_code = postalCode
  },

  [mutations.SET_STATE](state, area) {
    state.state = area
  },

  [mutations.SET_COUNTRY_ID](state, countryId) {
    state.country_id = countryId
  },

  [mutations.SET_CONTACTS](state, contacts) {
    state.contacts = contacts
  },

  [mutations.SET_CURRENCY_ID](state, currencyId) {
    state.currency_id = currencyId
  },

  [mutations.SET_LANGUAGE_ID](state, languageId) {
    state.language_id = languageId
  },

  [mutations.SET_PAYMENT_TERMS](state, paymentTerms) {
    state.payment_terms = paymentTerms
  },

  [mutations.SET_COMPANY_SIZE_ID](state, companySizeId) {
    state.company_size_id = companySizeId
  },

  [mutations.SET_INDUSTRY_ID](state, industryId) {
    state.industry_id = industryId
  },

  [mutations.SET_PRIVATE_NOTES](state, privateNotes) {
    state.private_notes = privateNotes
  }
}
