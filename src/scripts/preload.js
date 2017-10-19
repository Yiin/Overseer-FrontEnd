import store from '@/store'

export default () => {
  store.dispatch('PRELOAD_DATA')

  if (store.state.auth.isLoggedIn) {
    if (!store.state.preloadedData || Array.isArray(store.state.preloadedData)) {
      store.dispatch('auth/LOGOUT', { redirect: false })
    } else {
      const accessToken = store.state.preloadedData.access_token
      if (accessToken !== store.state.auth.accessToken) {
        // TODO: change accessToken
      }
      store.dispatch('INIT', store.state.preloadedData.data || null)
      store.dispatch('auth/LOAD')
    }
  } else {
    tryToAuthenticate()
  }

  function tryToAuthenticate() {
    if (!store.state.preloadedData) {
      return
    }
    if (store.state.auth.isLoggedIn) {
      return
    }
    const accessToken = store.state.preloadedData.access_token
    const user = store.state.preloadedData.user
    const preloadedData = store.state.preloadedData

    if (accessToken && user && preloadedData) {
      store.commit('auth/SET_WAS_REDIRECTED', true)
      store.dispatch('auth/AUTHENTICATE', { preloaded: true, accessToken, user, preloadedData })
      store.dispatch('auth/LOAD')
    }
  }
}
