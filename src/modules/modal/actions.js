/**
 * Modal actions
 */
import TaskbarItem from '@/modules/taskbar/item-types'
import * as mutations from './mutation-types'

export default {
  [`HANDLE_TASKBAR_OPEN_${TaskbarItem.MODAL}`]: ({ commit, dispatch }, data) => {
    commit(mutations.OPEN_MODAL, data)
  },

  [`HANDLE_TASKBAR_HIDE_${TaskbarItem.MODAL}`]: ({ commit, dispatch }, data) => {
    console.log('hide', data)
    dispatch(`form/${data.form}/RESET_FORM_DATA`, { root: true })
    commit(mutations.CLOSE_MODAL)
  },

  [`HANDLE_TASKBAR_CLOSE_${TaskbarItem.MODAL}`]: ({ commit, dispatch }, data) => {
    console.log('close', data)
    dispatch(`form/${data.form}/RESET_FORM_DATA`, { root: true })
    commit(mutations.CLOSE_MODAL)
  },

  UPDATE_MODAL_DATA: ({ commit, state }, data) => {
    commit(mutations.UPDATE_MODAL_DATA, data)
  },

  CREATE_MODAL: ({ dispatch }, data) => {
    dispatch('ADD_ITEM_TO_TASKBAR', {
      type: TaskbarItem.MODAL,
      data
    })
  },

  OPEN_MODAL: ({ dispatch, rootState }, data) => {
    dispatch('ACTIVATE_TASKBAR_ITEM', {
      type: TaskbarItem.MODAL,
      data,
      formData: rootState.form[data.form]
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
