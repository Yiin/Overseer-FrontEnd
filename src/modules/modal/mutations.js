import * as types from './mutation-types'

export default {
  [types.OPEN_MODAL](state, { title, component, data }) {
    state.isOpen = true
    state.title = title
    state.component = component
    state.data = data
  },

  [types.CLOSE_MODAL](state) {
    state.isOpen = false
  }
}
