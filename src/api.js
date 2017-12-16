import Vue from 'vue'
import store from './store'
import Auth from './auth'
import Echo from '@/echo'

/**
 * API Plugin
 *
 * Handles HTTP requests to project API.
 */
export default {
  /**
   * Install the API class.
   *
   * @param {Object} Vue The global Vue.
   * @return {void}
   */
  install(Vue) {
    Vue.http.options.root = '/api'

    Vue.http.interceptors.push((request, next) => {
      request.credentials = true

      // Auth header
      const token = store.state.auth.accessToken
      const hasAuthHeader = request.headers.has('Authorization')

      if (token && !hasAuthHeader) {
        Auth.setAuthHeader(request)
      }

      // X-Socket-ID
      const socketId = Echo.socketId()
      const hasSocketIdHeader = request.headers.has('X-Socket-ID')

      if (socketId && !hasSocketIdHeader) {
        request.headers.set('X-Socket-ID', socketId)
      }

      // Let server know currently selected company,
      // so it can check for right permissions
      if (store.state.auth.user) {
        request.headers.set('X-Current-Company', store.state.auth.user.company.uuid)
      }

      if ([
        // Do not check response for invalid token
        // in the routes listed below
        'login/refresh',
        'logout'
      ].indexOf(request.url) > -1) {
        next()
      } else {
        next((response) => {
          if (Auth._isInvalidToken(response)) {
            return Auth._refreshToken(request)
          }
        })
      }
    })

    Vue.prototype.$api = Vue.api = this
  },

  handleError(response) {
    if (parseInt(response.status) === 403 && response.body && response.body.error && response.body.error.message === 'invalid_token') {
      Auth.logout()
      return
    }
    return Promise.reject(response)
  },

  get(...args) {
    return Vue.http.get(...args).then((response) => response.body).catch(this.handleError)
  },

  post(...args) {
    return Vue.http.post(...args).then((response) => response.body).catch(this.handleError)
  },

  put(...args) {
    return Vue.http.put(...args).then((response) => response.body).catch(this.handleError)
  },

  delete(...args) {
    return Vue.http.delete(...args).then((response) => response.body).catch(this.handleError)
  },

  patch(...args) {
    return Vue.http.patch(...args).then((response) => response.body).catch(this.handleError)
  }
}
