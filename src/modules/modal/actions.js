/**
 * Modal actions
 */
import * as mutations from './mutation-types'
import * as taskbarMutations from '@/modules/taskbar/mutation-types'

export default {
  openNewModal: ({ commit }, data) => {
    commit(taskbarMutations.ADD_MODAL_TO_TASKBAR, data, { root: true })
    commit(mutations.OPEN_MODAL, data)
  },

  openModal: ({ commit }, data) => {
    commit(mutations.OPEN_MODAL, data)
  },

  hideModal: ({ commit }) => {
    commit(mutations.CLOSE_MODAL)
    commit(taskbarMutations.RESET_ACTIVE_ITEM, { root: true })
  },

  closeModal: ({ commit, rootState }) => {
    commit(taskbarMutations.REMOVE_ITEM_FROM_TASKBAR, rootState.taskbar.activeIndex, { root: true })
    commit(mutations.CLOSE_MODAL)
  }
}
