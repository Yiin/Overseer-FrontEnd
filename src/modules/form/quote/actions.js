export default {
  UPDATE_FIELD_VALUE({ commit }, { mutation, value }) {
    commit(mutation, value)
  },

  DISPLAY_ERRORS({ commit }, errors) {
    commit('SET_ERRORS', errors)
  }
}
