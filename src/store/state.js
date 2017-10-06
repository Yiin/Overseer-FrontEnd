let state = {
  // is app loaded?
  isLoaded: false,

  // user authentication data
  auth: {
    isLoggedIn: false,
    accessToken: null
  },

  // user data
  user: {
    guest_key: null,
    uuid: null,
    profile: {
      first_name: null,
      last_name: null,
      email: null,
      phone: null,
      job_position: null
    },
    username: null,
    company: null
  }
}

export const DEFAULT_STATE = Object.assign({}, state)

// Sync with local storage.
if (localStorage.getItem('state')) {
  const savedState = localStorage.getItem('state')

  if (savedState) {
    state = Object.assign(state, typeof savedState === 'string' ? JSON.parse(savedState) : savedState)
  }
}

// Merge data and export it.
export default state
