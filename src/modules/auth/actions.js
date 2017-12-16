import parseDomain from 'parse-domain'
import Echo from '@/echo'
import Api from '@/api'
import { OVERVIEW } from '@/router/routes'
import router from '@/router'
import AuthUser from '@models/auth-user'

export default {
  AUTHENTICATE({ commit, state, dispatch }, { preloaded = false, accessToken, user, preloadedData }) {
    /**
     * Redirect user to correct subdomain after authentication
     */
    if (!preloaded) {
      const domain = parseDomain(window.location.href, { customTlds: ['local'] })
      if (!domain.subdomain || domain.subdomain !== preloadedData.account.site_address) {
        commit('REDIRECTING', window.location.protocol + '//' + user.site_address + '.' + domain.domain + '.' + domain.tld + '/overview')
        commit('SET_AUTHENTICATED', true)

        if (state.isAcceptingInvitation) {
          dispatch('REDIRECT')
        }
        return
      }
    }

    /**
     * Update access token for API requests
     */
    commit('UPDATE_ACCESS_TOKEN', accessToken)

    /**
     * If we just logged in, we should not be locked.
     */
    commit('SET_LOCKED', false)

    dispatch('INIT', preloadedData, { root: true })

    if (!preloaded) {
      router.push({
        name: OVERVIEW
      })
    }
  },

  /**
   * Accept invitation, send api request to
   * save updated data about employee, enable
   * his user account and log him in.
   */
  ACCEPT_INVITATION({ dispatch }, data) {
    return Api.post(`accept-invitation`, data).then((response) => {
      const accessToken = response.access_token
      const preloadedData = response.preloadedData
      const user = preloadedData.user

      dispatch('AUTHENTICATE', { accessToken, user, preloadedData })
    })
  },

  /**
   * Redirect user to correct subdomain
   */
  REDIRECT({ state }) {
    if (state.isRedirecting) {
      setTimeout(() => {
        window.location.replace(state.redirectingTo)
      }, 100)
    }
  },

  /**
   * Set state as loaded.
   */
  LOAD({ commit }) {
    commit('SET_LOADED', true)
  },

  /**
   * Lock user account.
   *
   * TODO: encrypt state?
   * That would require to re-initiate all,
   * repository documents, because class objects
   * (i.e. documents) loses methods in
   * serialization process.
   */
  LOCK({ commit, state }) {
    if (state.isLocked) {
      return
    }
    // dispatch('ENCRYPT', null, { root: true })
    commit('SET_LOCKED', true)

    localStorage.setItem('state.auth', JSON.stringify(state))
  },

  UNLOCK({ commit, dispatch, state, rootState }, { pin }) {
    return Api.post('unlock', {
      pin
    }).then(() => {
      commit('SET_LOCKED', false)

      try {
        // dispatch('DECRYPT', '0000', { root: true })
      } catch (e) {
        // console.log(e)
      }

      localStorage.setItem('state.auth', JSON.stringify(state))
    })
  },

  LOGOUT({ commit }, { redirect = true } = {}) {
    Api.post('logout')

    const preloadedJsonEl = document.getElementById('preloaded_json')
    if (preloadedJsonEl) {
      preloadedJsonEl.parentNode.removeChild(preloadedJsonEl)
    }

    commit('CLEAR_ALL_DATA')

    localStorage.removeItem('state.auth')
    Echo.disconnect()

    if (redirect) {
      router.push({ name: 'login' })
    }
  },

  SET_USER({ commit }, user) {
    commit('SET_USER', AuthUser.create(user))
  },

  SAVE_USER_OVERVIEW_STATE(store, overviewState) {
    Api.post('user/state/overview', {
      overview_state: overviewState
    })
  }
}
