import router from '@/router'

/**
 * Modal actions
 */

export default {
  HANDLE_TASKBAR_OPEN({ commit, dispatch }, data) {
    if (data.route && router.currentRoute.name && router.currentRoute.name !== data.route.name) {
      router.push(data.route)
    }
    commit('OPEN', data)
  },

  HANDLE_TASKBAR_HIDE({ commit, dispatch }, data) {
    if (router.currentRoute.meta.goBack) {
      window.history.replaceState(null, document.title, router.currentRoute.meta.goBack)
    } else if (router.currentRoute.meta.previous) {
      router.push(router.currentRoute.meta.previous)
    }
    dispatch(`${data.module}/RESET_FORM_DATA`, null, { root: true })
    commit('HIDE')
  },

  HANDLE_TASKBAR_CLOSE({ commit, dispatch }, data) {
    if (router.currentRoute.meta.goBack) {
      window.history.replaceState(null, document.title, router.currentRoute.meta.goBack)
    } else if (router.currentRoute.meta.previous) {
      router.push(router.currentRoute.meta.previous)
    }
    dispatch(`${data.module}/RESET_FORM_DATA`, null, { root: true })
    commit('CLOSE')
  },

  CREATE: ({ dispatch }, data) => {
    dispatch('taskbar/ADD_ITEM', {
      type: 'modal',
      data
    }, { root: true })
  },

  OPEN: ({ dispatch, rootState }, data) => {
    dispatch('taskbar/ACTIVATE_ITEM', {
      type: 'modal',
      data
    }, { root: true })
  },

  HIDE: ({ dispatch, state }) => {
    dispatch('taskbar/DEACTIVATE_ITEM', state.data, { root: true })
  },

  CLOSE: ({ dispatch, state }) => {
    dispatch('taskbar/REMOVE_ITEM', state.data, { root: true })
  },

  UPDATE_ACTIVE_TAB_INDEX: ({ commit }, index) => {
    commit('UPDATE_ACTIVE_TAB_INDEX', index)
  }
}
