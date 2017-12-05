import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import User from '../models/user'

/**
 * Repository state
 */
const state = RepositoryState()
const mutations = RepositoryMutations()
const actions = RepositoryActions(User, {
  /**
   * Disable api actions for user repository, because
   * users are controlled internally.
   *
   * Public api routes should not exist anyway.
   */
  API_CREATE() {},
  API_UPDATE() {},
  API_PATCH() {},
  API_ARCHIVE() {},
  API_ARCHIVE_MANY() {},
  API_DELETE() {},
  API_DELETE_MANY() {},
  API_UNARCHIVE() {},
  API_UNARCHIVE_MANY() {},
  API_RESTORE() {},
  API_RESTORE_MANY() {}
})
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
export const methods = RepositoryMethods('user')
