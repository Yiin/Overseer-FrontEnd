import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import TaskList from '../models/task-list'

/**
 * Repository state
 */
const state = RepositoryState()
const mutations = RepositoryMutations()
const actions = RepositoryActions(TaskList)
const getters = RepositoryGetters({
  API_NAME: () => 'crm/task-lists',
  API_RESOURCE_NAME: () => 'task-list'
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
export const methods = RepositoryMethods('taskList')
