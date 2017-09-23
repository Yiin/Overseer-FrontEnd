import Vue from 'vue'

export default (mutations = {}) => Object.assign({
  SET_FORM_DATA(state, data) {
    for (let field in data) {
      Vue.set(state, field, data[field])

      if (data[field] && typeof data[field] === 'object') {
        if (typeof data[field].id !== 'undefined') {
          Vue.set(state, field + '_id', data[field].id)
        }
        if (typeof data[field].uuid !== 'undefined') {
          Vue.set(state, field + '_uuid', data[field].uuid)
        }
      }
    }
  },

  RESET_FORM_DATA(state) {
    const copy = Object.assign({}, state.__initial)

    for (let field in copy) {
      Vue.set(state, field, copy[field])
    }
  },

  SET_ERRORS(state, errors) {
    let err = {}

    for (let key in errors) {
      let field = key.split('.').slice(1).join('.')

      if (field.trim().length) {
        err[field] = errors[key]
      }
    }

    state.errors = err
  }
}, mutations)
