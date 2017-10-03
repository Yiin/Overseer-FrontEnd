import Vue from 'vue'

export default (mutations = {}) => Object.assign({
  SET_FORM_DATA(state, data) {
    for (let field in data) {
      console.log('setting', field, 'to', data[field])
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

  ADD_CREATE_LISTENER(state, fn) {
    state.listeners.create.push(fn)
  },

  RESET_FORM_DATA(state) {
    const copy = JSON.parse(JSON.stringify(state.__initial))

    console.log('reset form data', copy)

    for (let field in copy) {
      Vue.set(state, field, copy[field])
    }
    Vue.set(state, '__preview', false)
  },

  SET_ERRORS(state, errors) {
    let err = {}

    for (let key in errors) {
      const field = key.split('.').slice(1).join('.')

      if (field.trim().length) {
        err[field] = errors[key]
      }
    }

    state.errors = err
  }
}, mutations)
