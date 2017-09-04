import * as types from './mutation-types'

export default {
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
    state.user.username = user.username
    state.user.company = user.company
  },

  [types.UPDATE_LOCALE](state, locale) {
    state.locale = locale
  },

  /**
   * Clear each property, one by one, so reactivity still works.
   *
   * (ie. clear out state.auth.isLoggedIn so Navbar component automatically reacts to logged out state,
   * and the Navbar menu adjusts accordingly)
   *
   * TODO: use a common import of default state to reset these values with.
   */
  [types.CLEAR_ALL_DATA](state) {
    // Auth
    state.auth.isLoggedIn = false
    state.auth.accessToken = null

    // User
    state.user.profile.first_name = null
    state.user.profile.last_name = null
    state.user.profile.email = null
    state.user.profile.phone = null
    state.user.profile.job_position = null
    state.user.username = null
    state.user.company = null
  }
}
