import * as mutations from './mutation-types'

export default {
  [mutations.SET_PRODUCT_NAME](state, productName) {
    state.product_name = productName
  },

  [mutations.SET_PRICE](state, price) {
    state.price = price
  },

  [mutations.SET_CURRENCY](state, currency) {
    state.currency = currency
  },

  [mutations.SET_QUANTITY](state, quantity) {
    state.quantity = quantity
  },

  [mutations.SET_TAX_RATE](state, taxRateUuid) {
    state.tax_rate = taxRateUuid
  },

  [mutations.SET_DESCRIPTION](state, description) {
    state.description = description
  },

  [mutations.SET_IMAGES](state, images) {
    state.images = images
  }
}
