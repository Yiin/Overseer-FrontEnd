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
    Vue.http.options.root = process.env.API_ROOT

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

      if (request.url === 'login/refresh') {
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
    if (parseInt(response.status) === 403 && response.body && response.body.error && response.body.error.message === 'Invalid token') {
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
