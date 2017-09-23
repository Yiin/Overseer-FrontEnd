const state = {
  __name: 'project',

  uuid: '',

  name: '',
  description: '',
  client_uuid: null,

  errors: {}
}

state.__initial = Object.assign({}, state)

export default state
