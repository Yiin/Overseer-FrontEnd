export default {
  UPDATE_FIELD(state, { field, value }) {
    state.fields[field] = value
    if (!value) {
      switch (field) {
      case 'username':
        state.validationErrors.username = [
          'Please enter your email.'
        ]
        break
      case 'password':
        state.validationErrors.password = [
          'Please enter your password.'
        ]
      }
      state.hasError = true
    } else {
      if (state.validationErrors[field].length) {
        state.validationErrors[field] = []
      }
    }
  },

  SET_ERRORS(state, errors) {
    state.validationErrors = errors
  }
}
