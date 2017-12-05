import S from 'string'
import validators from '../validators'
import Statuses from '@/modules/documents/statuses'
import { getResourceName, getDocumentTitle } from '@/modules/documents/helpers'

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
      module: `form/${state._name}`,
      // type
      type: 'create',
      // timestamp key
      key: +(new Date()),
      // route name
      route: {
        name: getResourceName(state._name) + '.create'
      }
    }, { root: true })

    return new Promise((resolve) => {
      commit('ADD_CREATE_LISTENER', resolve)
    })
  },

  OPEN_EDIT_FORM({ dispatch, state, commit, rootGetters }, { title = null, data }) {
    if (typeof data.serialize === 'function') {
      dispatch('SET_FORM_DATA', data.serialize())
    } else {
      dispatch('SET_FORM_DATA', data)
    }

    const isArchived = Statuses.generic.archived.meetsCondition(data)

    if (isArchived) {
      commit('SET_PREVIEW', true)
    }

    if (!title) {
      if (isArchived) {
        title = 'archived document'
      } else {
        title = 'actions.edit_' + state._name
      }
    }

    return dispatch('modal/OPEN', {
      // meta data
      title,
      // form component we're rendering when modal is open
      component: 'edit-' + S(state._name).slugify().s,
      // path to current form's state
      module: `form/${state._name}`,
      // type
      type: 'edit',
      // key
      key: data.uuid,
      // route name
      route: {
        name: getResourceName(state._name) + '.edit',
        params: {
          uuid: data.uuid
        }
      }
    }, { root: true })
  },

  OPEN_PREVIEW_FORM({ dispatch, state, commit, rootGetters }, { title = null, data }) {
    if (typeof data.serialize === 'function') {
      dispatch('SET_FORM_DATA', data.serialize())
    } else {
      dispatch('SET_FORM_DATA', data)
    }

    const isArchived = Statuses.generic.archived.meetsCondition(data)

    commit('SET_PREVIEW', true)

    if (!title) {
      if (isArchived) {
        title = 'archived document'
      } else {
        title = 'actions.view_' + state._name
      }
    }

    return dispatch('modal/OPEN', {
      // meta data
      title,
      // form component we're rendering when modal is open
      component: 'edit-' + S(state._name).slugify().s,
      // path to current form's state
      module: `form/${state._name}`,
      // type
      type: 'view',
      // key
      key: data.uuid,
      // route name
      route: {
        name: getResourceName(state._name) + '.view',
        params: {
          uuid: data.uuid
        }
      }
    }, { root: true })
  },

  OPEN_HISTORY_REVIEW_FORM({ dispatch, commit, state }, { title, data, activity }) {
    if (typeof data.serialize === 'function') {
      dispatch('SET_FORM_DATA', data.serialize())
    } else {
      dispatch('SET_FORM_DATA', data)
    }

    commit('SET_PREVIEW', true)
    commit('SET_ACTIVITY', activity)

    return dispatch('modal/OPEN', {
      // meta data
      title,
      // form component we're rendering when modal is open
      component: 'edit-' + getResourceName(state._name),
      // path to current form's state
      module: `form/${state._name}`,
      // type
      type: 'revision',
      // key
      key: data.uuid + '/history/' + activity.id,
      // route name
      route: {
        name: getResourceName(state._name) + '.revision',
        params: {
          uuid: data.uuid,
          activity: activity.id
        }
      }
    }, { root: true })
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

      dispatch('notification/SHOW', {
        message: `${getDocumentTitle(state._name, 'singular|capitalize')} was created.`
      }, { root: true })
    })
    .catch((response) => {
      if (parseInt(response.status) === 422) {
        dispatch('SET_ERRORS', response.body.messages)
      }
      return response
    })
  },

  SAVE({ dispatch, state }) {
    return dispatch(`${repository}/API_UPDATE`, state.fields, {
      root: true
    })
    .then((response) => {
      console.log('form.SAVE: finished')

      state.listeners.update.forEach((fn) => {
        fn(response)
      })

      console.log('form.SAVE: listeners called')

      dispatch('notification/SHOW', {
        message: `${getDocumentTitle(state._name, 'singular|capitalize')} was updated.`
      }, { root: true })
    })
    .catch((response) => {
      if (parseInt(response.status) === 422) {
        dispatch('SET_ERRORS', response.body.messages)
      }
      return response
    })
  },

  RESTORE({ dispatch, state }) {
    return dispatch(`${repository}/API_UPDATE`, Object.assign(state.fields, {
      restoredFromActivity: state.activity.id
    }), {
      root: true
    }).then((response) => {
      state.listeners.update.forEach((fn) => {
        fn(response)
      })

      dispatch('notification/SHOW', {
        message: `${getDocumentTitle(state._name, 'singular|capitalize')} was restored.`
      }, { root: true })
    })
  },

  SET_ERRORS({ dispatch, commit, state }, errors) {
    const parsedErrors = {}

    for (let key in errors) {
      const field = key.split('.').slice(1, 2)[0]

      parsedErrors[field] = [errors[key]]

      const tabIndex = state.tabs.findIndex((tab) => {
        return tab.indexOf(field) > -1
      })

      dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', tabIndex, { root: true })

      break
    }
    commit('SET_ERRORS', parsedErrors)
  },

  SET_FIELD_VALUE({ commit }, { field, value }) {
    commit('SET_FORM_DATA', { [field]: value })
  }
}, actions)
