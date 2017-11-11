export default {
  OPEN({ commit }, { scope, position, items }) {
    commit('SET_IS_OPEN', true)
    commit('SET_SCOPE', scope)
    commit('SET_POSITION', position)
    commit('SET_ITEMS', items)
  },

  CLOSE({ commit }) {
    commit('SET_IS_OPEN', false)
  }
}
