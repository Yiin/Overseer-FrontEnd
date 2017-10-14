const state = {
  validationPromises: [],

  steps: [
    'ACCOUNT_DETAILS',
    'SITE_ADDRESS'
  ],
  step: 0,

  fields: {
    company_name: {
      errors: [],
      value: '',
      state: 'idle'
    },

    email: {
      errors: [],
      value: '',
      state: 'idle'
    },

    site_address: {
      errors: [],
      value: '',
      state: 'idle'
    },

    first_name: {
      errors: [],
      value: '',
      state: 'idle'
    },

    last_name: {
      errors: [],
      value: '',
      state: 'idle'
    },

    password: {
      errors: [],
      value: '',
      state: 'idle'
    },

    password_confirmation: {
      errors: [],
      value: '',
      state: 'idle'
    }
  }
}

state.__initial_state = JSON.parse(JSON.stringify(state))

export default state
