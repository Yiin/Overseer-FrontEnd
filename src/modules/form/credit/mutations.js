import * as mutations from './mutation-types'

export default {
  [mutations.SET_CLIENT](state, clientUuid) {
    state.client = clientUuid
  },

  [mutations.SET_AMOUNT](state, amount) {
    state.amount = amount
  },

  [mutations.SET_CURRENCY](state, currency) {
    state.currency = currency
  },

  [mutations.SET_CREDIT_DATE](state, date) {
    state.credit_date = date
  },

  [mutations.SET_CREDIT_DUE_DATE](state, dueDate) {
    state.credit_due_date = dueDate
  }
}
