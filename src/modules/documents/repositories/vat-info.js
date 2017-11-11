import { RepositoryState, RepositoryMutations, RepositoryActions, RepositoryGetters, RepositoryMethods } from './base'
import { VatInfo } from '../models/vat'

/**
 * Repository state
 */
const state = RepositoryState({
  key(item) {
    return item.countryCode + item.number + '@' + item.checkedAt
  }
})
const mutations = RepositoryMutations()
const actions = RepositoryActions(VatInfo)
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
export const methods = RepositoryMethods('vatInfo')
