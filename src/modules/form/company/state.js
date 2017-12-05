import FormState from '../base/state'

const state = FormState('company', {
  fields: {
    uuid: '',

    name: '',
    email: ''
  },

  tabs: [
    [
      'name',
      'email'
    ]
  ],

  errors: {}
})

export default state
