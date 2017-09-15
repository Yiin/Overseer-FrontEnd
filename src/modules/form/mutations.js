export default (mutations = {}) => Object.assign({
  SET_FORM_DATA(state, data) {
    for (let field in data) {
      state[field] = data[field]

      if (data[field] && typeof data[field] === 'object') {
        if (typeof data[field].id !== 'undefined') {
          state[field + '_id'] = data[field].id
        }
        if (typeof data[field].uuid !== 'undefined') {
          state[field + '_uuid'] = data[field].uuid
        }
      }
    }
  },

  RESET_FORM_DATA(state) {
    const copy = Object.assign({}, state.__initial)

    for (let field in copy) {
      state[field] = copy[field]
    }
  },

  SET_ERRORS(state, errors) {
    state.errors = errors
  }
}, mutations)
