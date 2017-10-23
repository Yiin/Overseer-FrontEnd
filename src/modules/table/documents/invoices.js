import TableState from '../base/state'
import TableMutations from '../base/mutations'
import TableActions from '../base/actions'
import TableGetters from '../base/getters'
import { is, isNot } from '@/modules/documents/statuses'

/**
 * Path to repository to get items from
 */
const repository = ['documents', 'repositories', 'invoice']

/**
 * Table store
 */
const state = TableState()
const mutations = TableMutations()
const actions = TableActions()
const getters = TableGetters(repository, {
  /**
   * Invoice is waiting for payments, only
   * if it is neither draft nor already paid
   */
  waitingForPayments(state, getters) {
    return getters.activeItems.filter((invoice) => {
      return isNot('invoice', invoice, ['draft', 'paid'])
    })
  },

  overdue(state, getters) {
    return getters.activeItems.filter((invoice) => {
      return is('invoice', invoice, 'overdue')
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
