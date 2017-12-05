import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import Company from '../models/company'

/**
 * Repository state
 */
const state = RepositoryState()
const mutations = RepositoryMutations()
const actions = RepositoryActions(Company)
const getters = RepositoryGetters({
  API_NAME: () => 'companies',
  API_RESOURCE_NAME: () => 'company'
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
export const methods = RepositoryMethods('company')
