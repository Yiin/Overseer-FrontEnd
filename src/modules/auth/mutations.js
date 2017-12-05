export default {
  UPDATE_ACCESS_TOKEN(state, accessToken) {
    state.isLoggedIn = true
    state.accessToken = accessToken
  },

  SET_AUTHENTICATED(state, isAuthenticated) {
    state.isLoggedIn = isAuthenticated
  },

  SET_LOCKED(state, isLocked) {
    state.isLocked = isLocked
  },

  SET_ACCOUNT(state, account) {
    state.account = account
  },

  SET_USER(state, user) {
    state.user = user
  },

  SET_CURRENT_COMPANY(state, company) {
    state.user.company = company
  },

  LOAD(state) {
    state.isLoaded = true
  },

  REDIRECTING(state, to) {
    state.isRedirecting = true
    state.redirectingTo = to
  },

  SET_WAS_REDIRECTED(state, wasRedirected) {
    state.wasRedirected = wasRedirected
  },

  /**
   * Resets main state
   */
  CLEAR_ALL_DATA(state) {
    const copy = JSON.parse(JSON.stringify(state.__initial_state))

    for (let key in copy) {
      state[key] = copy[key]
    }
  }
}
