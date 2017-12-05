let state = {
  // state flags
  isLoggedIn: false,
  isLocked: false,
  isLoaded: false,

  // are we currently redirecting user?
  isRedirecting: false,

  // where are we redirecting the user.
  redirectingTo: null,

  // did user came here from redirection?
  wasRedirected: false,

  // Access token for API
  accessToken: null,

  /**
   * Update this instance ONLY through mutations.
   * The only reason I put auth user object here
   * is to keep reactivity working.
   *
   * @var {AuthUser}  Currently authenticated user data
   */
  user: {}
}

state.__initial_state = JSON.parse(JSON.stringify(state))

export default state
