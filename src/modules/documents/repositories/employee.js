import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import Employee from '../models/employee'
import store from '@/store'

/**
 * Repository state
 */
const state = RepositoryState()
const mutations = RepositoryMutations()
const actions = RepositoryActions(Employee)
const getters = RepositoryGetters({
  API_NAME: () => 'employees',
  API_RESOURCE_NAME: () => 'employee',

  /**
   * Return company items
   */
  AVAILABLE_COMPANY_ITEMS(state, getters) {
    return getters.AVAILABLE_ITEMS.filter((employee) => {
      return employee.isInCompany(store.state.auth.user.company.uuid)
    })
  },

  ACTIVE_COMPANY_ITEMS(state, getters) {
    return getters.ACTIVE_ITEMS.filter((employee) => {
      return employee.isInCompany(store.state.auth.user.company.uuid)
    })
  }
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
export const methods = RepositoryMethods('employee').setModel(Employee)
