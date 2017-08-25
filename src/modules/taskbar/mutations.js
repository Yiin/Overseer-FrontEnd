import store from '@/store'
import * as types from './mutation-types'

export default {
  [types.REMOVE_ITEM_FROM_TASKBAR](state, index) {
    state.items.splice(index, 1)

    if (state.activeIndex === index) {
      state.activeIndex = null
    }
  },

  [types.ADD_MODAL_TO_TASKBAR](state, modalToAdd) {
    if (!store.getters.modals.find((item) => item.data === modalToAdd)) {
      state.activeIndex = state.items.push({ type: 'modal', data: modalToAdd }) - 1
    }
  },

  [types.SET_ACTIVE_ITEM](state, item) {
    const index = state.items.indexOf(item)
    state.activeIndex = index > -1 ? index : null
  },

  [types.RESET_ACTIVE_ITEM](state) {
    state.activeIndex = null
  }
}
