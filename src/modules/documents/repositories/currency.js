import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import Currency from '../models/currency'

/**
 * Repository state
 */
const state = RepositoryState({
  key: 'code'
})
const mutations = RepositoryMutations()
const actions = RepositoryActions(Currency)
const getters = RepositoryGetters()

/**
 * Exports
 */
export default {
  namespaced: true,

  state,
  mutations,
  actions,
  getters
}
export const methods = RepositoryMethods('currency')
