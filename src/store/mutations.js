export default {
  SET_ENCRYPTED(state, data) {
    state.encryptedData = data
  },

  CLEAR_ENCRYPTED(state) {
    state.encryptedData = null
  },

  SET_PRELOADED_DATA(state, preloadedData) {
    state.preloadedData = preloadedData
  },

  UPDATE_SCALE(state, { ratio, offset }) {
    state.scale.ratio = ratio
    state.scale.offset = offset
  },

  RESET_SCALE(state) {
    state.scale.ratio = 1
    state.scale.offset = 0
  },

  HIDE_SIDEBAR(state, isHidden) {
    state.ui.sidebar.isHidden = isHidden
  }
}
