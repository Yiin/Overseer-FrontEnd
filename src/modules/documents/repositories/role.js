import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import Role from '../models/role'

/**
 * Repository state
 */
const state = RepositoryState()
const mutations = RepositoryMutations()
const actions = RepositoryActions(Role)
const getters = RepositoryGetters({
  API_NAME: () => 'authorization/roles',
  API_RESOURCE_NAME: () => 'role'
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
export const methods = RepositoryMethods('role').setModel(Role)
