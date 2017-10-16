import pluralize from 'pluralize'
import S from 'string'
import validators from './validators'

export default (actions = {}) => Object.assign({
  VALIDATE({ commit, state }, field) {
    const result = validators[state.__name](state.fields)

    if (typeof field === 'undefined') {
      commit('SET_ERRORS', result)
    } else {
      commit('SET_FIELD_ERRORS', {
        field,
        errors: result[field]
      })
    }
  },

  SET_FORM_DATA({ commit }, data) {
    commit('SET_FORM_DATA', data)
  },

  RESET_FORM_DATA({ commit }) {
    commit('RESET_FORM_DATA')
  },

  OPEN_CREATE_FORM({ commit, dispatch, state }) {
    dispatch('RESET_FORM_DATA')

    dispatch('CREATE_MODAL', {
      // meta data
      title: 'actions.new_' + state.__name,
      // form component we're rendering when modal is open
      component: 'edit-' + S(state.__name).slugify().s,
      // namespace to current form's state
      form: state.__name
    }, { root: true })

    return new Promise((resolve) => {
      commit('ADD_CREATE_LISTENER', resolve)
    })
  },

  OPEN_EDIT_FORM({ dispatch, state }, data) {
    dispatch('SET_FORM_DATA', data)

    return dispatch('OPEN_MODAL', {
      // meta data
      title: 'actions.edit_' + state.__name,
      // form component we're rendering when modal is open
      component: 'edit-' + S(state.__name).slugify().s,
      // namespace to current form's state
      form: state.__name
    }, { root: true })
  },

  OPEN_PREVIEW_FORM({ dispatch }, data) {
    dispatch('SET_FORM_DATA', {
      __preview: true
    })
    return dispatch('OPEN_EDIT_FORM', data)
  },

  FILL({ dispatch, commit, state }) {
    return dispatch(`table/${pluralize(state.__name)}/FILL`, null, { root: true })
      .then((data) => {
        delete data.uuid
        commit('SET_FORM_DATA', data)
      })
  },

  CREATE({ dispatch, state }) {
    const listeners = state.listeners.create.slice()

    return dispatch(`table/${pluralize(state.__name)}/CREATE_DOCUMENT`, {
      data: state.fields
    }, {
      root: true
    })
    .then((response) => {
      listeners.forEach((fn) => {
        fn(response)
      })
    })
    .catch((response) => {
      if (parseInt(response.status) === 422) {
        dispatch('SET_ERRORS', response.body.messages)
      }
    })
  },

  SAVE({ dispatch, state }) {
    dispatch(`table/${pluralize(state.__name)}/SAVE_DOCUMENT`, {
      uuid: state.fields.uuid,
      data: state.fields
    }, {
      root: true
    })
    .then((response) => {
      state.listeners.update.forEach((fn) => {
        fn(response)
      })
    })
    .catch((response) => {
      if (parseInt(response.status) === 422) {
        dispatch('SET_ERRORS', response.body.messages)
      }
    })
  },

  SET_ERRORS({ dispatch, commit, state }, errors) {
    commit('SET_ERRORS', errors)

    for (let key in errors) {
      const field = key.split('.').slice(1, 2)[0]

      const tabIndex = state.tabs.findIndex((tab) => {
        return tab.indexOf(field) > -1
      })

      dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', tabIndex, { root: true })

      break
    }
  },

  SET_FIELD_VALUE({ commit }, { field, value }) {
    commit('SET_FORM_DATA', { [field]: value })
  }
}, actions)
