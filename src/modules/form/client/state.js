const state = {
  // Organization
  company_name: '',
  registration_number: '',
  vat_number: '',
  website: '',
  phone: '',
  logo: null,

  // Address
  address1: '',
  address2: '',
  city: '',
  postal_code: '',
  state: '',
  country: null, // id

  // Contacts
  contacts: [
    /* {
      first_name
      last_name
      job_position
      email
      phone
    } */
  ],

  currency: null, // id
  language: null, // id
  payment_terms: null, // integer
  company_size: null, // id
  industry: null, // id
  private_notes: '',

  errors: {}
}

export default state
