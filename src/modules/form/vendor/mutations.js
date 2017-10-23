import FormMutations from '../base/mutations'

export default FormMutations({
  ADD_NEW_CONTACT(state) {
    state.fields.contacts.push({
      first_name: '',
      last_name: '',
      job_position: '',
      email: '',
      phone: ''
    })
  },

  REMOVE_CONTACT(state, index) {
    state.fields.contacts.splice(index, 1)
  },

  SET_CONTACT_FIELD(state, { index, field, value }) {
    state.fields.contacts[index][field] = value
  }
})
