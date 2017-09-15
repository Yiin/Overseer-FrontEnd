import * as types from './mutation-types'

export default {
  [types.OPEN_MODAL](state, data) {
    state.isOpen = true
    state.data = data
  },

  [types.CLOSE_MODAL](state) {
    state.isOpen = false
    state.activeTabIndex = 0
    state.data.title = null
    state.data.component = null
    state.data.form = ''
  },

  [types.UPDATE_ACTIVE_TAB_INDEX](state, index) {
    state.activeTabIndex = index
  }
}
