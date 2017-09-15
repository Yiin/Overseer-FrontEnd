const state = {
  uuid: '',

  // Organization
  name: '',
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
  country_id: null, // id

  // Contacts
  contacts: [
    {
      first_name: '',
      last_name: '',
      job_position: '',
      email: '',
      phone: ''
    }
  ],

  currency_id: null, // id
  language_id: null, // id
  payment_terms: null, // integer
  company_size_id: null, // id
  industry_id: null, // id
  // notes: '',

  errors: {}
}

state.__initial = Object.assign({}, state)

export default state
