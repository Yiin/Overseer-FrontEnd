import { defaultOptions } from './state'

export default {
  SHOW({ commit }, options) {
    options = Object.assign({}, defaultOptions, options)

    commit('SET_OPTIONS', options)

    commit('SET_VISIBLE', false) // reset timeout timer
    setTimeout(() => commit('SET_VISIBLE', true))
  },

  CLOSE({ commit }) {
    commit('SET_VISIBLE', false)
  }
}
