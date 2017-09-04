/**
 * Modal actions
 */
import TaskbarItem from '@/modules/taskbar/item-types'
import * as mutations from './mutation-types'

export default {
  HANDLE_TASKBAR_OPEN_MODAL: ({ commit }, data) => {
    commit(mutations.OPEN_MODAL, data)
  },

  HANDLE_TASKBAR_HIDE_MODAL: ({ commit }) => {
    commit(mutations.CLOSE_MODAL)
  },

  HANDLE_TASKBAR_CLOSE_MODAL: ({ commit }) => {
    commit(mutations.CLOSE_MODAL)
  },

  UPDATE_MODAL_DATA: ({ commit, state }, data) => {
    commit(mutations.UPDATE_MODAL_DATA, data)
  },

  CREATE_MODAL: ({ dispatch }, data) => {
    dispatch('ADD_ITEM_TO_TASKBAR', {
      type: TaskbarItem.MODAL,
      data: Object.assign({ data: {} }, data)
    })
  },

  OPEN_MODAL: ({ dispatch }, data) => {
    dispatch('ACTIVATE_TASKBAR_ITEM', {
      type: TaskbarItem.MODAL,
      data
    })
  },

  HIDE_MODAL: ({ dispatch, state }) => {
    dispatch('DEACTIVATE_TASKBAR_ITEM', state.data)
  },

  CLOSE_MODAL: ({ dispatch, state }) => {
    dispatch('REMOVE_TASKBAR_ITEM', state.data)
  },

  UPDATE_MODAL_TABS: ({ commit }, tabs) => {
    commit('UPDATE_MODAL_TABS', tabs)
  },

  UPDATE_MODAL_ACTIVE_TAB_INDEX: ({ commit }, index) => {
    commit('UPDATE_ACTIVE_TAB_INDEX', index)
  }
}
