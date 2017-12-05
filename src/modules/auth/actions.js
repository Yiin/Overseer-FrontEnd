import parseDomain from 'parse-domain'
import Echo from '@/echo'
import Api from '@/api'
import { OVERVIEW } from '@/router/routes'
import router from '@/router'
import AuthUser from '@/modules/documents/models/auth-user'

export default {
  AUTHENTICATE({ commit, state, dispatch }, { preloaded = false, accessToken, user, preloadedData }) {
    /**
     * Redirect user to correct subdomain after authentication
     */
    if (!preloaded) {
      const domain = parseDomain(window.location.href)
      if (!domain.subdomain || domain.subdomain !== preloadedData.account.site_address) {
        commit('REDIRECTING', window.location.protocol + '//' + user.site_address + '.' + domain.domain + '.' + domain.tld + '/overview')
        commit('SET_AUTHENTICATED', true)
        return
      }
    }

    /**
     * Update access token for API requests
     */
    commit('UPDATE_ACCESS_TOKEN', accessToken)

    /**
     * Load companies
     */
    dispatch('documents/repositories/company/SET_ITEMS', preloadedData.data.companies, { root: true })
    dispatch('documents/repositories/employee/ADD_ITEMS', preloadedData.data.companies.reduce((employees, company) => {
      return employees.concat(company.employees)
    }, []), { root: true })

    /**
     * Set account and user data
     */
    commit('SET_ACCOUNT', preloadedData.account)
    dispatch('SET_USER', user)

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

  REDIRECT({ state }) {
    if (state.isRedirecting) {
      setTimeout(() => {
        window.location.replace(state.redirectingTo)
      }, 100)
    }
  },

  LOAD({ commit }) {
    commit('LOAD')
  },

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
  }
}
