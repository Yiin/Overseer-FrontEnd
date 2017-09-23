export default {
  SHOW_POPUP({ commit }, data) {
    console.log('actions/SHOW_POPUP', data)
    commit('SHOW_POPUP', data)
  },

  CLOSE_POPUP({ commit }) {
    commit('CLOSE_POPUP')
  }
}
