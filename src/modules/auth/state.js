let state = {
  isLoggedIn: false,
  isLoaded: false,
  isRedirecting: false,
  redirectingTo: null,
  wasRedirected: false,
  accessToken: null,

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
    site_address: '',
    username: null,
    company: null,
    settings: {},
    preferences: {}
  },

  animation: {
    steps: [
      'chill',
      'hide-text',
      'expand-button',
      'fade-out',
      'finished',
      'revert'
    ],
    currentStep: 0
  }
}

state.__initial_state = JSON.parse(JSON.stringify(state))

// Sync with local storage.
if (localStorage.getItem('state.auth')) {
  const savedState = localStorage.getItem('state.auth')

  if (savedState) {
    state = Object.assign(state, typeof savedState === 'string' ? JSON.parse(savedState) : savedState)
  }
}

export default state
