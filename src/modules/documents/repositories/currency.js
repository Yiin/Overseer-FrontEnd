import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import Currency from '../models/currency'
import $store from '@/store'

/**
 * Repository state
 */
const state = RepositoryState({
  key: 'code'
})
const mutations = RepositoryMutations()
const actions = RepositoryActions(Currency)
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
export const methods = RepositoryMethods('currency', () => {
  return {
    findOrDefault(currencyDataOrCode) {
      const currency = typeof currencyDataOrCode === 'object'
        ? this.find(currencyDataOrCode)
        : this.findByKey(currencyDataOrCode)

      if (currency) {
        return currency
      } else {
        return $store.state.settings.currency
      }
    }
  }
})
