import pluralize from 'pluralize'
import S from 'string'

export default (actions = {}) => Object.assign({
  SET_FORM_DATA({ commit }, data) {
    commit('SET_FORM_DATA', data)
  },

  RESET_FORM_DATA({ commit }) {
    commit('RESET_FORM_DATA')
  },

  OPEN_CREATE_FORM({ dispatch, state }) {
    dispatch('RESET_FORM_DATA')

    dispatch('CREATE_MODAL', {
      // meta data
      title: 'actions.new_' + state.__name,
      // form component we're rendering when modal is open
      component: 'edit-' + S(state.__name).slugify().s,
      // namespace to current form's state
      form: state.__name
    }, { root: true })
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

  CREATE({ dispatch, commit, state }) {
    return dispatch(`table/${pluralize(state.__name)}/CREATE_DOCUMENT`, {
      data: {
        [S(state.__name).slugify().s]: state
      }
    }, {
      root: true
    })
    .catch((response) => {
      if (parseInt(response.status) === 422) {
        commit('SET_ERRORS', response.body.messages)
      }
    })
  },

  SAVE({ dispatch, commit, state }) {
    dispatch(`table/${pluralize(state.__name)}/SAVE_DOCUMENT`, {
      uuid: state.uuid,
      data: {
        [S(state.__name).slugify().s]: state
      }
    }, {
      root: true
    })
    .catch((response) => {
      if (parseInt(response.status) === 422) {
        commit('SET_ERRORS', response.body.messages)
      }
    })
  },

  UPDATE_FIELD_VALUE({ commit }, { field, value }) {
    commit('SET_FORM_DATA', { [field]: value })
  }
}, actions)
