import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import Activity from '../models/activity'

/**
 * Repository state
 */
const state = RepositoryState({
  key: 'id'
})
const mutations = RepositoryMutations()
const actions = RepositoryActions(Activity)
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
export const methods = RepositoryMethods('activity').setModel(Activity)
