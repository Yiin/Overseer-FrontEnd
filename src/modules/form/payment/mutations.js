import * as mutations from './mutation-types'

export default {
  [mutations.SET_ERRORS](state, errors) {
    state.errors = errors
  },

  [mutations.SET_CLIENT](state, clientUuid) {
    state.client = clientUuid
  },

  [mutations.SET_INVOICE](state, invoiceUuid) {
    state.invoice = invoiceUuid
  },

  [mutations.SET_PRICE](state, price) {
    state.price = price
  },

  [mutations.SET_CURRENCY](state, currency) {
    state.currency = currency
  },

  [mutations.SET_PAYMENT_TYPE](state, type) {
    state.payment_type = type
  },

  [mutations.SET_PAYMENT_DATE](state, date) {
    state.payment_date = date
  },

  [mutations.SET_PAYMENT_REFERENCE](state, reference) {
    state.payment_reference = reference
  }
}
