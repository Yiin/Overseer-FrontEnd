import TableGetters from '@/modules/table/base/getters'
import { is, isNot } from '@/modules/documents/statuses'

export default TableGetters({
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
