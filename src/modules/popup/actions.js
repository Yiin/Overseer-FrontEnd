export default {
  SHOW_POPUP({ commit }, data) {
    commit('SHOW_POPUP', data)
  },

  CLOSE_POPUP({ commit }) {
    commit('CLOSE_POPUP')
  }
}
