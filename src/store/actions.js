import * as types from './mutation-types'
import Auth from '@/auth'
import Api from '@/api'
import { OVERVIEW } from '@/router/routes'

export const login = ({ commit }, creds) => {
  Auth.login(creds, OVERVIEW)
}

export const register = ({ commit }, data) => {
  Auth.register(data, OVERVIEW)
}

/**
 * Update state with auth details
 */
export const authenticate = ({ commit }, { auth }) => {
  commit(types.UPDATE_AUTH, auth)
}

/**
 * Load table data
 */
export const preloadData = ({ commit, getters }, { name }) => {
  commit(types.PRELOAD_TABLE, { name })

  Api.get(name, {
    params: getters[`${name}Table`]
  }).then((response) => {
    commit(types.UPDATE_TABLE, { name, data: response })
  })
}

/**
 * Toggle table row
 */
export const toggleRow = ({ commit }, data) => {
  commit(types.TOGGLE_ROW, data)
}
