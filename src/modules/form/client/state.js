import FormState from '@/modules/form/state'

const state = FormState({
  __name: 'client',

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

  currency_code: null, // id
  language_id: null, // id
  payment_terms: null, // integer
  company_size_id: null, // id
  industry_id: null, // id

  tabs: [
    [
      'name',
      'registration_number',
      'vat_number',
      'website',
      'phone',
      'logo'
    ],
    [
      'address1',
      'address2',
      'city',
      'postal_code',
      'state',
      'country_id'
    ],
    [
      'contacts'
    ],
    [
      'currency_code',
      'language_id',
      'payment_terms',
      'company_size_id',
      'industry_id'
    ]
  ],

  errors: {}
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
