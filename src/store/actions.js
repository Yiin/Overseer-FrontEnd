import * as types from './mutation-types'
import Echo from '@/echo'
import i18n from '@/i18n'
import Auth from '@/auth'
import { OVERVIEW } from '@/router/routes'
import router from '@/router'
import { getTableName } from '@/modules/documents/helpers'
import DocumentsList from '@/modules/documents/list'

export const INIT = ({ dispatch }) => {
  /* Static Data */
  dispatch('LOAD_STATIC_DATA')

  /* Documents */
  const promises = []

  DocumentsList.forEach((key) => {
    const tableName = getTableName(key)
    promises.push(dispatch(`table/${tableName}/LOAD_TABLE`))
  })

  // once all documents are loaded, link relationships
  Promise.all(promises).then(() => {
    DocumentsList.forEach((key) => {
      const tableName = getTableName(key)
      dispatch(`table/${tableName}/UPDATE_RELATIONS`)
    })
  })

  /* Features */
  dispatch(`features/vat_checker/LOAD_RESULTS`)

  /* Real time */
  Echo.connect()
}

export const LOGIN = ({ dispatch }, creds) => {
  Auth.login(creds)
    .then((response) => {
      const accessToken = response.body.access_token
      const user = response.body.user

      dispatch('AUTHENTICATE', { accessToken, user })
    })
}

export const REGISTER = ({ dispatch }, data) => {
  Auth.register(data)
    .then((response) => {
      const accessToken = response.body.access_token
      const user = response.body.user

      dispatch('AUTHENTICATE', { accessToken, user })
    })
}

export const AUTHENTICATE = ({ commit, state, dispatch }, { accessToken, user }) => {
  commit(types.UPDATE_ACCESS_TOKEN, accessToken)
  commit(types.UPDATE_USER, user)

  localStorage.setItem('state', JSON.stringify({
    auth: state.auth,
    user: state.user,
    locale: state.locale
  }))

  dispatch('INIT')

  console.log('goto overview')
  router.push({
    name: OVERVIEW
  })
}

export const LOGOUT = ({ commit }) => {
  commit(types.CLEAR_ALL_DATA)

  localStorage.removeItem('state')
  Echo.disconnect()

  router.push({ name: 'login' })
}

export const CHANGE_LOCALE = ({ commit, store }, locale) => {
  i18n.locale = locale
  commit(types.UPDATE_LOCALE, locale)
}
