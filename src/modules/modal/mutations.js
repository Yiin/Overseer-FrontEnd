export default {
  OPEN(state, data) {
    state.isOpen = true
    state.data = data
  },

  HIDE(state) {
    state.isOpen = false
    state.activeTabIndex = 0
    state.data.title = null
    state.data.component = null
    state.data.form = ''
  },

  CLOSE(state) {
    state.isOpen = false
    state.activeTabIndex = 0
    state.data.title = null
    state.data.component = null
    state.data.form = ''
  },

  UPDATE_ACTIVE_TAB_INDEX(state, index) {
    state.activeTabIndex = index
  }
}
