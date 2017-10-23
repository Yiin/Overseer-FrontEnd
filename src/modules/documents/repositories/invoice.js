import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import Invoice from '../models/invoice'

/**
 * Repository state
 */
const state = RepositoryState()
const mutations = RepositoryMutations()
const actions = RepositoryActions(Invoice)
const getters = RepositoryGetters({
  API_NAME: () => 'invoices',
  API_RESOURCE_NAME: () => 'invoice'
})

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
export const methods = RepositoryMethods('invoice')
