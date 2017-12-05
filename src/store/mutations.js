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
    state.scale.ratio = ''
    state.scale.offset = 0
  },

  OVERLAY(state, item) {
    state.ui.overlay.items.push(item)
  },

  UNDERLAY(state, item) {
    state.ui.overlay.items = state.ui.overlay.items.filter((overlayItem) => {
      return overlayItem !== item
    })
  },

  HIDE_SIDEBAR(state, isHidden) {
    state.ui.sidebar.isHidden = isHidden
  }
}
