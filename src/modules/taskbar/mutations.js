import { copyFields } from '@/scripts'

export default {
  SET_STATE(state, newState) {
    copyFields(newState, state)
  },

  SAVE_ITEM(state, index) {
    if (index > -1 && index < state.items.length) {
      state.savedTasks.unshift(index)
    }
  },

  ADD_ITEM(state, taskbarItem) {
    state.items.push(taskbarItem)
  },

  SET_ACTIVE_ITEM(state, index) {
    if (index > -1 && index < state.items.length) {
      if (state.activeIndex !== null) {
        state.savedTasks.unshift(state.activeIndex)
      }
      state.activeIndex = index

      if (state.savedTasks.indexOf(index) > -1) {
        state.savedTasks.splice(state.savedTasks.indexOf(index), 1)
      }
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
    state.items.splice(index, 1)

    if (state.savedTasks.indexOf(index) > -1) {
      state.savedTasks.splice(state.savedTasks.indexOf(index), 1)
    }
    if (state.activeIndex === index) {
      state.activeIndex = state.savedTasks.length ? state.savedTasks.pop() : null
    }
  }
}
