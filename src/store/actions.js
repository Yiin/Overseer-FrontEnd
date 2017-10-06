import * as types from './mutation-types'
import Echo from '@/echo'
import Api from '@/api'
import Auth from '@/auth'
import { OVERVIEW } from '@/router/routes'
import router from '@/router'
import { getTableName } from '@/modules/documents/helpers'
import DocumentsList from '@/modules/documents/list'

export const INIT = ({ dispatch, commit, state }, preloadedData = null) => {
  const promises = []

  // Use preloaded data if possible, load everything if not
  const preloadedJsonEl = document.getElementById('preloaded_json')
  if (!preloadedData && preloadedJsonEl) {
    preloadedData = JSON.parse(preloadedJsonEl.innerHTML)
    preloadedJsonEl.parentNode.removeChild(preloadedJsonEl)
  }
  if (preloadedData && preloadedData.data) {
    const data = preloadedData.data

    dispatch('SET_STATIC_DATA', data.passive)
    dispatch('settings/SET_SETTINGS', state.user.settings)

    /* Documents */
    for (let key in data.documents) {
      const tableName = getTableName(key)
      commit(`table/${tableName}/SET_TABLE_ITEMS`, data.documents[key])
      commit(`table/${tableName}/NORMALIZE_TABLE`)
    }
    DocumentsList.forEach((key) => {
      const tableName = getTableName(key)
      dispatch(`table/${tableName}/UPDATE_RELATIONS`)
    })

    dispatch('system/SET_ACTIVITY_LOG', data.system.activityLog)
  } else {
    /* Static Data */
    dispatch('LOAD_STATIC_DATA').then(() => {
      dispatch('settings/SET_SETTINGS', state.user.settings)
    })

    dispatch('system/UPDATE_ACTIVITY_LOG')

    /* Documents */
    DocumentsList.forEach((key) => {
      const tableName = getTableName(key)
      promises.push(dispatch(`table/${tableName}/LOAD_TABLE`))
    })

    /* Features */
    dispatch(`features/vat_checker/LOAD_RESULTS`)
  }

  // once all documents are loaded, link relationships
  Promise.all(promises).then(() => {
    DocumentsList.forEach((key) => {
      const tableName = getTableName(key)
      dispatch(`table/${tableName}/UPDATE_RELATIONS`)
    })
  })

  /* Real time */
  Echo.connect()
}

export const LOGIN_DEMO = ({ dispatch }) => {
  return Api.post('demo').then((response) => {
    const accessToken = response.access_token
    const user = response.user
    const preloadedData = response.preloadedData

    dispatch('AUTHENTICATE', { accessToken, user, preloadedData })
  })
}

export const LOGIN = ({ dispatch }, creds) => {
  return Auth.login(creds)
    .then((response) => {
      const accessToken = response.body.access_token
      const user = response.body.user
      const preloadedData = response.body.preloadedData

      dispatch('AUTHENTICATE', { accessToken, user, preloadedData })
    })
}

export const REGISTER = ({ dispatch }, data) => {
  Auth.register(data)
    .then((response) => {
      const accessToken = response.body.access_token
      const user = response.body.user
      const preloadedData = response.body.preloadedData

      dispatch('AUTHENTICATE', { accessToken, user, preloadedData })
    })
}

export const AUTHENTICATE = ({ commit, state, dispatch }, { accessToken, user, preloadedData }) => {
  commit(types.UPDATE_ACCESS_TOKEN, accessToken)
  commit(types.UPDATE_USER, user)

  if (!user.guest_key) {
    localStorage.setItem('state', JSON.stringify({
      auth: state.auth,
      user: state.user
    }))
  }

  dispatch('INIT', preloadedData)

  router.push({
    name: OVERVIEW
  })
}

export const LOGOUT = ({ commit }) => {
  Api.post('logout')

  const preloadedJsonEl = document.getElementById('preloaded_json')
  if (preloadedJsonEl) {
    preloadedJsonEl.parentNode.removeChild(preloadedJsonEl)
  }

  commit(types.CLEAR_ALL_DATA)

  localStorage.removeItem('state')
  Echo.disconnect()

  router.push({ name: 'login' })
}
