import Api from '@/api'
import Auth from '@/auth'

export default {
  REGISTER({ dispatch }, data) {
    return Auth.register(data)
      .then((response) => {
        const accessToken = response.body.access_token
        const preloadedData = response.body.preloadedData
        const user = preloadedData.user

        dispatch('auth/AUTHENTICATE', { accessToken, user, preloadedData }, { root: true })
      })
  },

  VALIDATE({ commit, state }) {
    const fields = {}

    for (let field in state.fields) {
      fields[field] = state.fields[field].value
    }

    delete fields.site_address

    const promise = Api.post('register/validate', fields).then((errors) => {
      if (Object.keys(errors).length) {
        for (let key in errors) {
          commit('UPDATE_FIELD_ERRORS', {
            field: key,
            errors: errors[key] || []
          })
        }
      }
      commit('REMOVE_VALIDATION_PROMISE', promise)
    })

    commit('ADD_VALIDATION_PROMISE', promise)

    return promise
  },

  VALIDATE_FIELD({ commit, state }, field) {
    const data = {
      [field]: state.fields[field].value
    }

    if (field === 'password') {
      data.password_confirmation = state.fields.password_confirmation.value
    }

    const promise = Api.post('register/validate', data).then((errors) => {
      commit('UPDATE_FIELD_ERRORS', {
        field,
        errors: errors[field] || []
      })
      commit('REMOVE_VALIDATION_PROMISE', promise)
    })

    commit('ADD_VALIDATION_PROMISE', promise)

    return promise
  }
}
