import Vue from 'vue'
import store from '@/store'
import { UPDATE_ACCESS_TOKEN } from '@/store/mutation-types'

/**
 * @var{string} LOGIN_URL The endpoint for logging in.
 */
const LOGIN_URL = 'login'

/**
 * @var{string} REGISTRATION_URL The endpoint for registration.
 */
const REGISTRATION_URL = 'register'

/**
 * @var{string} REFRESH_TOKEN_URL The endpoint for refreshing an access_token. This endpoint should be proxied
 *    by Webpack dev server and maybe nginx in production (cleaner calls and avoids CORS issues).
 */
const REFRESH_TOKEN_URL = 'login/refresh'

/**
 * @var{Object} AUTH_BASIC_HEADERS The options to pass into a Vue-resource http call. Includes
 *    the headers used for login and token refresh and emulateJSON flag since we are hitting an
 *    OAuth server directly that can't handle application/json.
 */
const AUTH_BASIC_HEADERS = {
  emulateJSON: true
}

/**
 * Auth Plugin
 *
 * Handles login and token authentication using OAuth2.
 */
export default {

  /**
   * Install the Auth class.
   *
   * Creates a Vue-resource http interceptor to handle automatically adding auth headers
   * and refreshing tokens. Then attaches this object to the global Vue (as Vue.auth).
   *
   * @param {Object} Vue The global Vue.
   * @return {void}
   */
  install(Vue) {
    Vue.prototype.$auth = Vue.auth = this
  },

  /**
   * Register
   *
   * @param {Object.<string>} data The data for registration.
   * @param {string|null} redirect The name of the Route to redirect to.
   * @return {Promise}
   */
  register(data) {
    return Vue.http.post(REGISTRATION_URL, data, AUTH_BASIC_HEADERS)
      .catch(() => {
        //
      })
  },

  /**
   * Login
   *
   * @param {Object.<string>} creds The username and password for logging in.
   * @param {string|null} redirect The name of the Route to redirect to.
   * @return {Promise}
   */
  login(creds) {
    const params = {
      'site_address': creds.site_address,
      'username': creds.username,
      'password': creds.password
    }

    return Vue.http.post(LOGIN_URL, params, AUTH_BASIC_HEADERS)
      .catch((e) => {
        console.log('FAILED LOGIN')
        throw e
      })
  },

  logout() {
    store.dispatch('LOGOUT')
  },

  /**
   * Set the Authorization header on a Vue-resource Request.
   *
   * @param {Request} request The Vue-Resource Request instance to set the header on.
   * @return {void}
   */
  setAuthHeader(request) {
    request.headers.set('Authorization', 'Bearer ' + store.state.auth.accessToken)
  },

  /**
   * Retry the original request.
   *
   * Let's retry the user's original target request that had recieved a invalid token response
   * (which we fixed with a token refresh).
   *
   * @param {Request} request The Vue-resource Request instance to use to repeat an http call.
   * @return {Promise}
   */
  _retry(request) {
    this.setAuthHeader(request)

    return Vue.http(request)
      .then((response) => {
        return response
      })
      .catch((response) => {
        return response
      })
  },

  /**
   * Refresh the access token
   *
   * Make an ajax call to the OAuth2 server to refresh the access token (using our refresh token).
   *
   * @private
   * @param {Request} request Vue-resource Request instance, the original request that we'll retry.
   * @return {Promise}
   */
  _refreshToken(request) {
    return Vue.http.post(REFRESH_TOKEN_URL, {}, AUTH_BASIC_HEADERS)
      .then((response) => {
        store.commit(UPDATE_ACCESS_TOKEN, response.body.access_token)
        return this._retry(request)
      })
      .catch((errorResponse) => {
        if (this._isInvalidToken(errorResponse)) {
          this.logout()
        }
        return errorResponse
      })
  },

  /**
   * Check if the Vue-resource Response is an invalid token response.
   *
   * @private
   * @param {Response} response The Vue-resource Response instance received from an http call.
   * @return {boolean}
   */
  _isInvalidToken(response) {
    const status = response.status
    const error = response.data.message

    return (status === 401 || error === 'invalid_token' || error === 'invalid_credentials')
  }
}
