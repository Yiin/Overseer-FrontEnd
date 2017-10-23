import S from 'string'
import validators from '../validators'

export default ({ model, repository }, actions = {}) => Object.assign({
  VALIDATE({ commit, state }, field) {
    const result = validators[state._name](state.fields)

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

    dispatch('modal/CREATE', {
      // meta data
      title: 'actions.new_' + state._name,
      // form component we're rendering when modal is open
      component: 'edit-' + S(state._name).slugify().s,
      // path to current form's state
      module: `form/${state._name}`
    }, { root: true })

    return new Promise((resolve) => {
      commit('ADD_CREATE_LISTENER', resolve)
    })
  },

  OPEN_EDIT_FORM({ dispatch, state }, data) {
    if (typeof data.serialize === 'function') {
      console.log('serialize')
      dispatch('SET_FORM_DATA', data.serialize())
    } else {
      dispatch('SET_FORM_DATA', data)
    }

    return dispatch('modal/OPEN', {
      // meta data
      title: 'actions.edit_' + state._name,
      // form component we're rendering when modal is open
      component: 'edit-' + S(state._name).slugify().s,
      // path to current form's state
      module: `form/${state._name}`
    }, { root: true })
  },

  OPEN_PREVIEW_FORM({ dispatch, commit }, data) {
    commit('SET_PREVIEW', true)
    return dispatch('OPEN_EDIT_FORM', data)
  },

  FILL({ commit }) {
    commit('SET_FORM_DATA', model.fakeData())
  },

  CREATE({ dispatch, state }) {
    const listeners = state.listeners.create.slice()

    return dispatch(`${repository}/API_CREATE`, state.fields, {
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
    dispatch(`${repository}/API_UPDATE`, state.fields, {
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

      dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', tabIndex, { root: true })

      break
    }
  },

  SET_FIELD_VALUE({ commit }, { field, value }) {
    commit('SET_FORM_DATA', { [field]: value })
  }
}, actions)
