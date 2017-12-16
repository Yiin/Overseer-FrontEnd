import Vue from 'vue'
import { copyFields } from '@/scripts'

export default (mutations = {}) => Object.assign({
  SET_FORM_STATE(state, newState) {
    copyFields(/* from */ newState, /* to */ state)
  },

  SET_PREVIEW(state, preview) {
    state._preview = preview
  },

  SET_ACTIVITY(state, activity) {
    state.activity = activity
  },

  SET_FORM_DATA(state, data) {
    for (let field in JSON.parse(JSON.stringify(data))) {
      Vue.set(state.fields, field, data[field])
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

    copyFields(copy, state)

    state.validationErrors = {}
  },

  SET_FIELD_ERRORS(state, { field, errors }) {
    state.validationErrors[field] = errors
  },

  SET_ERRORS(state, errors) {
    state.validationErrors = {}
    for (let field in errors) {
      state.validationErrors[field] = errors[field]
    }
  }
}, mutations)
