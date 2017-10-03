export default {
  /**
   * Save reference to specifix taskbar item,
   * so we can get back to it later.
   */
  SAVE_TASKBAR_ITEM({ commit, state }, item) {
    const index = state.items.findIndex((taskbarItem) => taskbarItem.data === item.data)

    commit('SAVE_TASKBAR_ITEM', index)
  },

  /**
   * Activate previously used taskbar item
   */
  ACTIVATE_SAVED_TASKBAR_ITEM({ dispatch, state }, index = 0) {
    dispatch('ACTIVATE_TASKBAR_ITEM_AT_INDEX', state.savedTasks[index])
  },

  /**
   * Add new item to taskbar, and activate after
   * @param {string} options.type   Type of the item / Name of the module
   * @param {object} options.item   Item data
   */
  ADD_ITEM_TO_TASKBAR({ commit, dispatch, state, rootState }, { type, data }) {
    const taskbarItem = { type, data, savedData: null }
    commit('ADD_ITEM', taskbarItem)

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
    commit('SET_ACTIVE_ITEM', index)

    // if there is saved data, load it to form
    if (state.items[index].savedData) {
      dispatch(`form/${state.items[index].data.form}/SET_FORM_DATA`, state.items[index].savedData)
    }

    const ACTION_PREFIX = state.items[index].type
    dispatch('HANDLE_TASKBAR_OPEN_' + ACTION_PREFIX, state.items[index].data)
  },

  DEACTIVATE_TASKBAR_ITEM({ commit, dispatch, state, rootState }, data) {
    commit('RESET_ACTIVE_ITEM')

    const index = state.items.findIndex((taskbarItem) => taskbarItem.data === data)

    if (index > -1) {
      commit('SAVE_TASKBAR_ITEM_DATA', index)
      commit('SAVE_TASKBAR_ITEM_FORM_DATA', {
        index,
        formData: rootState.form[data.form]
      })

      const ACTION_PREFIX = state.items[index].type
      dispatch('HANDLE_TASKBAR_HIDE_' + ACTION_PREFIX, state.items[index].data)
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
    const ACTION_PREFIX = state.items[index].type
    dispatch('HANDLE_TASKBAR_CLOSE_' + ACTION_PREFIX, state.items[index].data)

    commit('REMOVE_ITEM_AT_INDEX', index)
    if (state.activeIndex !== null) {
      dispatch('ACTIVATE_TASKBAR_ITEM_AT_INDEX', state.activeIndex)
    }
  }

}
