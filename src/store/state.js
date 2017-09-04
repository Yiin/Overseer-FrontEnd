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
  state = Object.assign(state, JSON.parse(localStorage.getItem('state')))
}

// Merge data and export it.
export default state
