import TableState from '../base/state'
import TableMutations from '../base/mutations'
import TableActions from '../base/actions'
import TableGetters from '../base/getters'

/**
 * Path to repository to get items from
 */
const repository = ['documents', 'repositories', 'vendor']

/**
 * Table store
 */
const state = TableState()
const mutations = TableMutations()
const actions = TableActions()
const getters = TableGetters(repository)

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
