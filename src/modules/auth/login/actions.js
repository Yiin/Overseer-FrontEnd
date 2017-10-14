import Api from '@/api'
import Auth from '@/auth'

export default {
  LOGIN_DEMO({ dispatch }) {
    return Api.post('demo').then((response) => {
      const accessToken = response.access_token
      const user = response.user
      const preloadedData = response.preloadedData

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
      console.log(errors)
      return false
    }

    return Auth.login(creds)
      .then((response) => {
        const accessToken = response.body.access_token
        const user = response.body.user
        const preloadedData = response.body.preloadedData

        dispatch('auth/AUTHENTICATE', { accessToken, user, preloadedData }, { root: true })
      })
      .catch(() => {
        commit('SET_ERRORS', {
          password: 'Wrong Login or Password. Try again.'
        })
      })
  }
}
