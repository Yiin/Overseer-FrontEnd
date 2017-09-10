let state = {
  auth: {
    isLoggedIn: false,
    accessToken: null
  },
  user: {
    profile: {
      first_name: null,
      last_name: null,
      email: null,
      phone: null,
      job_position: null
    },
    username: null,
    company: null
  },
  locale: 'en'
}

// Sync with local storage.
if (localStorage.getItem('state')) {
  const savedState = localStorage.getItem('state')

  if (savedState) {
    state = Object.assign(state, typeof savedState === 'string' ? JSON.parse(savedState) : savedState)
  }
}

// Merge data and export it.
export default state
