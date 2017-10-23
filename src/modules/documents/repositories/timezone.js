import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import Timezone from '../models/timezone'

/**
 * Repository state
 */
const state = RepositoryState({
  key: 'id'
})
const mutations = RepositoryMutations()
const actions = RepositoryActions(Timezone)
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
export const methods = RepositoryMethods('timezone')
