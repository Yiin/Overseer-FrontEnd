const state = {
  __name: 'vendor',

  uuid: '',

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
  notes: '',

  errors: {}
}

state.__initial = Object.assign({}, state)

export default state
