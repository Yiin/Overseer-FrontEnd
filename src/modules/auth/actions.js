import Echo from '@/echo'
import Api from '@/api'
import { OVERVIEW } from '@/router/routes'
import router from '@/router'
import parseDomain from 'parse-domain'

export default {
  AUTHENTICATE({ commit, state, dispatch }, { preloaded = false, accessToken, user, preloadedData }) {
    if (!preloaded) {
      const domain = parseDomain(window.location.href)
      if (!domain.subdomain || domain.subdomain !== user.site_address) {
        commit('REDIRECTING', window.location.protocol + '//' + user.site_address + '.' + domain.domain + '.' + domain.tld + '/overview')
        commit('SET_AUTHENTICATED', true)
        return
      }
    }

    commit('UPDATE_ACCESS_TOKEN', accessToken)
    commit('UPDATE_USER', user)

    localStorage.setItem('state.auth', JSON.stringify(state))

    dispatch('INIT', preloadedData.data, { root: true })

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

  LOGOUT({ commit }, { redirect = true }) {
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
  }
}
