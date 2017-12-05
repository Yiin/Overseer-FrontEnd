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
    commit('OVERLAY', 'modal', { root: true })
  },

  HANDLE_TASKBAR_HIDE({ commit }) {
    if (router.currentRoute.meta.goBack) {
      window.history.replaceState(null, document.title, router.currentRoute.meta.goBack)
    } else if (router.currentRoute.meta.previous) {
      router.push(router.currentRoute.meta.previous)
    }
    commit('HIDE')
    commit('UNDERLAY', 'modal', { root: true })
  },

  HANDLE_TASKBAR_CLOSE({ commit }) {
    if (router.currentRoute.meta.goBack) {
      window.history.replaceState(null, document.title, router.currentRoute.meta.goBack)
    } else if (router.currentRoute.meta.previous) {
      router.push(router.currentRoute.meta.previous)
    }
    commit('CLOSE')
    commit('UNDERLAY', 'modal', { root: true })
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
