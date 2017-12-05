import Api from '@/api'
import Auth from '@/auth'

export default {
  LOGIN_DEMO({ dispatch }) {
    return Api.post('demo').then((response) => {
      const accessToken = response.access_token
      const preloadedData = response.preloadedData
      const user = preloadedData.user

      dispatch('auth/AUTHENTICATE', { accessToken, user, preloadedData }, { root: true })
    })
  },

  LOGIN({ dispatch, commit, state }, creds) {
    let errors = {}

    if (!creds.username) {
      errors.username = ['Please enter your email.']
    }

    if (!creds.password) {
      errors.password = ['Please enter your password.']
    }

    commit('SET_ERRORS', errors)

    if (errors.username || errors.password) {
      return false
    }

    return Auth.login(creds)
      .then((response) => {
        const accessToken = response.body.access_token
        const preloadedData = response.body.preloadedData
        const user = preloadedData.user

        dispatch('auth/AUTHENTICATE', { accessToken, user, preloadedData }, { root: true })
      })
      .catch(() => {
        commit('SET_ERRORS', {
          username: [],
          password: ['Wrong Login or Password. Try again.']
        })
      })
  }
}
