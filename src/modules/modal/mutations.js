import * as types from './mutation-types'

export default {
  [types.OPEN_MODAL](state, data) {
    state.isOpen = true
    state.data = data
  },

  [types.CLOSE_MODAL](state) {
    state.isOpen = false
    state.data = null
    state.tabs = []
    state.activeTabIndex = 0
  },

  [types.UPDATE_MODAL_TABS](state, tabs) {
    state.tabs = tabs
  },

  [types.UPDATE_ACTIVE_TAB_INDEX](state, index) {
    state.activeTabIndex = index
  }
}
