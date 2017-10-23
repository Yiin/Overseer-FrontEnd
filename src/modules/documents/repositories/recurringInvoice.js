import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import RecurringInvoice from '../models/recurring-invoice'

/**
 * Repository state
 */
const state = RepositoryState()
const mutations = RepositoryMutations()
const actions = RepositoryActions(RecurringInvoice)
const getters = RepositoryGetters({
  API_NAME: () => 'recurring-invoices',
  API_RESOURCE_NAME: () => 'recurring-invoice'
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
export const methods = RepositoryMethods('recurring-invoice')
