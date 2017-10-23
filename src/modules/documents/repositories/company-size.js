import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import CompanySize from '../models/company-size'

/**
 * Repository state
 */
const state = RepositoryState({
  key: 'id'
})
const mutations = RepositoryMutations()
const actions = RepositoryActions(CompanySize)
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
export const methods = RepositoryMethods('companySize')
