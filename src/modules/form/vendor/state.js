import FormState from '@/modules/form/state'

const state = FormState({
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

  currency_code: '', // id
  notes: '',

  tabs: [
    [
      'company_name',
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
      'currency_code'
    ]
  ],

  errors: {}
})

state.__initial = JSON.parse(JSON.stringify(state))

export default state
