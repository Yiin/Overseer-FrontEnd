import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import PaymentType from '../models/payment-type'

/**
 * Repository state
 */
const state = RepositoryState({
  key: 'id'
})
const mutations = RepositoryMutations()
const actions = RepositoryActions(PaymentType)
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
export const methods = RepositoryMethods('paymentType')
