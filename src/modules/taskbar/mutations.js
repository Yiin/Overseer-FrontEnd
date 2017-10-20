import { copyFields } from '@/scripts'

export default {
  SET_STATE(state, newState) {
    copyFields(newState, state)
  },

  ADD_ITEM(state, taskbarItem) {
    state.items.push(taskbarItem)
  },

  SET_ACTIVE_ITEM(state, index) {
    if (index === state.activeIndex) {
      return
    }
    if (index > -1 && index < state.items.length) {
      if (state.activeIndex !== null && state.items[state.activeIndex].parent !== state.items[index]) {
        state.items[index].parent = state.items[state.activeIndex]
      }
      state.activeIndex = index
    } else {
      state.activeIndex = null
    }
  },

  SAVE_ITEM_DATA(state, index) {
    state.items[index].data = Object.assign({}, state.items[index].data)
  },

  SAVE_ITEM_STATE(state, { index, itemState }) {
    state.items[index].itemState = Object.assign({}, itemState)
  },

  RESET_ACTIVE_ITEM(state) {
    state.activeIndex = null
  },

  REMOVE_ITEM_AT_INDEX(state, index) {
    state.items.forEach((item) => {
      if (item.parent && item.parent === state.items[index]) {
        item.parent = undefined
      }
    })

    const parent = state.items[index].parent

    state.items.splice(index, 1)

    if (parent) {
      const parentIndex = state.items.findIndex((item) => item === parent)

      if (parentIndex > -1) {
        state.activeIndex = parentIndex
        return
      }
    }
    state.activeIndex = null
  }
}
