import store from '@/store'
import router from '@/router'

function logout() {
  store.dispatch('auth/LOGOUT', { redirect: false })
}

function tryToAuthenticate({ redirected = true } = {}) {
  /**
   * No preloaded data means user wasn't authenticated on server side
   */
  if (!store.state.preloadedData || !store.state.preloadedData.auth) {
    return false
  }

  const accessToken = store.state.preloadedData.auth.access_token
  const user = store.state.preloadedData.user
  const preloadedData = store.state.preloadedData

  if (accessToken && user && preloadedData) {
    if (redirected) {
      store.commit('auth/SET_WAS_REDIRECTED', true)
    }
    store.dispatch('auth/AUTHENTICATE', { preloaded: true, accessToken, user, preloadedData })
    store.dispatch('auth/LOAD')
    return true
  }
  return false
}

export default () => {
  store.dispatch('PRELOAD_DATA')

  if (store.state.auth.isLoggedIn) {
    if (!store.state.preloadedData) {
      logout()
    } else {
      if (!tryToAuthenticate({ redirected: false })) {
        logout()
      }
    }
  } else {
    if (!tryToAuthenticate()) {
      if (router.currentRoute.name === 'invite') {
        // Do not redirect to login if user accepting
        // invitation
        return
      }
      logout()
    }
  }
}
