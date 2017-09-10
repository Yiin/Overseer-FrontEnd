import * as mutations from './mutation-types'

export default {
  [mutations.SET_ERRORS](state, errors) {
    state.errors = errors
  },

  [mutations.SET_VENDOR](state, vendorUuid) {
    state.vendor = vendorUuid
  },

  [mutations.SET_CATEGORY](state, categoryUuid) {
    state.category = categoryUuid
  },

  [mutations.SET_AMOUNT](state, amount) {
    state.amount = amount
  },

  [mutations.SET_CURRENCY](state, currencyId) {
    state.currency = currencyId
  },

  [mutations.SET_DATE](state, date) {
    state.date = date
  },

  [mutations.SET_DOCUMENTS](state, documents) {
    state.documents = documents
  }
}
