import * as mutations from './mutation-types'
import * as modalMutations from '@/modules/modal/mutation-types'

export default {
  activateItem({ commit }, item) {
    commit(mutations.SET_ACTIVE_ITEM, item)
    commit(modalMutations.OPEN_MODAL, item.data)
  }
}
