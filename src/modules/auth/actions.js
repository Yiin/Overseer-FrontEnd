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
    commit('SET_LOCKED', false)

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
  }
}
