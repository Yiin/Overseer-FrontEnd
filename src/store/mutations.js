import * as types from './mutation-types'
import { DEFAULT_STATE } from './state'

export default {
  SET_LOADED(state) {
    state.isLoaded = true
  },

  [types.UPDATE_ACCESS_TOKEN](state, accessToken) {
    state.auth.isLoggedIn = true
    state.auth.accessToken = accessToken
  },

  [types.UPDATE_USER](state, user) {
    state.user.profile.first_name = user.profile.first_name
    state.user.profile.last_name = user.profile.last_name
    state.user.profile.email = user.profile.email
    state.user.profile.phone = user.profile.phone
    state.user.profile.job_position = user.profile.job_position
    state.user.settings = user.settings
    state.user.username = user.username
    state.user.company = user.company
    state.user.uuid = user.uuid
  },

  /**
   * Resets main state
   *
   * TODO: Reset modules state also
   */
  [types.CLEAR_ALL_DATA](state) {
    for (let key in DEFAULT_STATE) {
      state[key] = DEFAULT_STATE[key]
    }
  }
}
