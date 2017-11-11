import Api from '@/api'

export default {
  SAVE_STATE({ state }) {
    Api.post('user/taskbar', {
      taskbar: {
        items: state.items,
        savedTasks: state.savedTasks
      }
    })
  },

  /**
   * Activate previously used taskbar item
   */
  ACTIVATE_SAVED_ITEM({ dispatch, state }, index = 0) {
    dispatch('ACTIVATE_ITEM_AT_INDEX', state.savedTasks[index])
  },

  /**
   * Add new item to taskbar and activate after
   * @param {string} options.type   Type of the item / Name of the module
   * @param {object} options.item   Item data
   */
  ADD_ITEM({ commit, dispatch, state, rootState }, { type, data }) {
    const colorIndex = state.items.length ? (state.items[state.items.length - 1].colorIndex % 7) + 1 : 1
    const taskbarItem = { type, data, isNew: true, itemState: null, colorIndex }

    commit('ADD_ITEM', taskbarItem)

    // new item is always last item
    dispatch('ACTIVATE_ITEM_AT_INDEX', state.items.length - 1)
    dispatch('SAVE_STATE')
  },

  /**
   * Create new or open existing item
   * @param {string} options.type   Type of the item / Name of the module
   * @param {[type]} options.item            Item data
   */
  ACTIVATE_ITEM({ dispatch, state }, item) {
    const index = state.items.findIndex((taskbarItem) => taskbarItem.data.key === item.data.key)

    // exists, open
    if (index > -1) {
      state.items[index].isNew = false
      dispatch('ACTIVATE_ITEM_AT_INDEX', index)
    } else {
      // create new
      dispatch('ADD_ITEM', item)
    }
  },

  ACTIVATE_ITEM_AT_INDEX({ commit, dispatch, state }, index) {
    if (index < 0 || index >= state.items.length) {
      return
    }
    commit('SET_ACTIVE_ITEM', index)

    // if there is saved data - load it to the form
    if (state.items[index].itemState) {
      commit(`${state.items[index].data.module}/SET_FORM_STATE`, state.items[index].itemState, { root: true })
    }

    const ACTION_PREFIX = state.items[index].type
    dispatch(ACTION_PREFIX + '/HANDLE_TASKBAR_OPEN', state.items[index].data, { root: true })
  },

  DEACTIVATE_ITEM({ commit, dispatch, state, rootState }, data) {
    commit('RESET_ACTIVE_ITEM')

    const index = state.items.findIndex((taskbarItem) => taskbarItem.data.key === data.key)

    if (index > -1) {
      const itemState = JSON.parse(JSON.stringify(data.module.split('/').reduce((val, key) => val[key], rootState)))
      commit('SAVE_ITEM_DATA', index)
      commit('SAVE_ITEM_STATE', {
        index,
        itemState
      })

      const ACTION_PREFIX = state.items[index].type
      dispatch(ACTION_PREFIX + '/HANDLE_TASKBAR_HIDE', state.items[index].data, { root: true })
      dispatch('SAVE_STATE')
    }
  },

  REMOVE_ACTIVE_ITEM({ dispatch, state }) {
    dispatch('REMOVE_ITEM_AT_INDEX', state.activeIndex)
  },

  REMOVE_ITEM({ dispatch, state }, item) {
    const index = state.items.findIndex((taskbarItem) => taskbarItem.data.key === item.key)

    if (index > -1) {
      dispatch('REMOVE_ITEM_AT_INDEX', index)
    }
  },

  REMOVE_ITEM_AT_INDEX({ commit, dispatch, state }, index) {
    if (index < 0 || index >= state.items.length) {
      return
    }

    const ACTION_PREFIX = state.items[index].type
    dispatch(ACTION_PREFIX + '/HANDLE_TASKBAR_CLOSE', state.items[index].data, { root: true })

    commit('REMOVE_ITEM_AT_INDEX', index)
    if (state.activeIndex !== null) {
      dispatch('ACTIVATE_ITEM_AT_INDEX', state.activeIndex)
    }
    dispatch('SAVE_STATE')
  }
}
