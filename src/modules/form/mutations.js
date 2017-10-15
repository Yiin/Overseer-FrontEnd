import Vue from 'vue'

export default (mutations = {}) => Object.assign({
  SET_FORM_DATA(state, data) {
    for (let field in data) {
      Vue.set(state.fields, field, data[field])

      if (data[field] && typeof data[field] === 'object') {
        if (typeof data[field].id !== 'undefined') {
          Vue.set(state.fields, field + '_id', data[field].id)
        }
        if (typeof data[field].uuid !== 'undefined') {
          Vue.set(state.fields, field + '_uuid', data[field].uuid)
        }
      }
    }
  },

  SET_FIELD_VALUE(state, { field, value }) {
    state.fields[field] = value
  },

  ADD_CREATE_LISTENER(state, fn) {
    state.listeners.create.push(fn)
  },

  RESET_FORM_DATA(state) {
    const copy = JSON.parse(JSON.stringify(state.__initial))

    for (let field in copy) {
      Vue.set(state.fields, field, copy[field])
    }
    Vue.set(state, '__preview', false)
  },

  SET_FIELD_ERRORS(state, { field, errors }) {
    state.validationErrors[field] = errors
  },

  SET_ERRORS(state, errors) {
    for (let field in errors) {
      state.validationErrors[field] = errors[field]
    }
  }
}, mutations)
