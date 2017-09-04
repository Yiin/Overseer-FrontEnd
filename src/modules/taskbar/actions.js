import * as mutations from './mutation-types'

export default {
  /**
   * Add new item to taskbar, and activate after
   * @param {string} options.type   Type of the item / Name of the module
   * @param {object} options.item   Item data
   */
  ADD_ITEM_TO_TASKBAR({ commit, dispatch, state }, { type, data }) {
    const taskbarItem = { type, data }
    commit(mutations.ADD_ITEM, taskbarItem)

    // new item is always last item
    dispatch('ACTIVATE_TASKBAR_ITEM_AT_INDEX', state.items.length - 1)
  },

  /**
   * Create new or open existing item
   * @param {string} options.type   Type of the item / Name of the module
   * @param {[type]} options.item            Item data
   */
  ACTIVATE_TASKBAR_ITEM({ dispatch, state }, item) {
    const index = state.items.findIndex((taskbarItem) => taskbarItem.data === item.data)

    // exists, open
    if (index > -1) {
      dispatch('ACTIVATE_TASKBAR_ITEM_AT_INDEX', index)
    } else {
      // create new
      dispatch('ADD_ITEM_TO_TASKBAR', item)
    }
  },

  ACTIVATE_TASKBAR_ITEM_AT_INDEX({ commit, dispatch, state }, index) {
    if (index < 0 || index >= state.items.length) {
      return
    }
    commit(mutations.SET_ACTIVE_ITEM, index)

    const ACTION_PREFIX = state.items[index].type.toUpperCase()
    dispatch('HANDLE_TASKBAR_OPEN_' + ACTION_PREFIX, state.items[index].data)
  },

  DEACTIVATE_TASKBAR_ITEM({ commit, dispatch, state }, data) {
    commit(mutations.RESET_ACTIVE_ITEM)

    const index = state.items.findIndex((taskbarItem) => taskbarItem.data === data)

    if (index > -1) {
      const ACTION_PREFIX = state.items[index].type.toUpperCase()
      dispatch('HANDLE_TASKBAR_HIDE_' + ACTION_PREFIX, state.items[index])
    }
  },

  REMOVE_ACTIVE_TASKBAR_ITEM({ dispatch, state }) {
    dispatch('REMOVE_TASKBAR_ITEM_AT_INDEX', state.activeIndex)
  },

  REMOVE_TASKBAR_ITEM({ dispatch, state }, item) {
    const index = state.items.findIndex((taskbarItem) => taskbarItem.data === item)

    if (index > -1) {
      dispatch('REMOVE_TASKBAR_ITEM_AT_INDEX', index)
    }
  },

  REMOVE_TASKBAR_ITEM_AT_INDEX({ commit, dispatch, state }, index) {
    if (index < 0 || index >= state.items.length) {
      return
    }
    const ACTION_PREFIX = state.items[index].type.toUpperCase()
    dispatch('HANDLE_TASKBAR_CLOSE_' + ACTION_PREFIX)

    commit(mutations.REMOVE_ITEM_AT_INDEX, index)
  }

}
