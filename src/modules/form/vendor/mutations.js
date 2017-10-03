import FormMutations from '@/modules/form/mutations'

export default FormMutations({
  ADD_NEW_CONTACT(state) {
    state.contacts.push({
      first_name: '',
      last_name: '',
      job_position: '',
      email: '',
      phone: ''
    })
  },

  REMOVE_CONTACT(state, index) {
    state.contacts.splice(index, 1)
  },

  SET_CONTACT_FIRST_NAME(state, { value, data }) {
    state.contacts[data].first_name = value
  },

  SET_CONTACT_LAST_NAME(state, { value, data }) {
    state.contacts[data].last_name = value
  },

  SET_CONTACT_JOB_POSITION(state, { value, data }) {
    state.contacts[data].job_position = value
  },

  SET_CONTACT_PHONE(state, { value, data }) {
    state.contacts[data].phone = value
  },

  SET_CONTACT_EMAIL(state, { value, data }) {
    state.contacts[data].email = value
  }
})
