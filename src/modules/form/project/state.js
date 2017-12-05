import FormState from '../base/state'

const state = FormState({
  _name: 'project',

  uuid: '',

  name: '',
  description: '',
  client_uuid: null,

  errors: {}
})

export default state
