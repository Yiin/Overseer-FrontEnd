import { getTableName } from '@/modules/documents/helpers'

export default {
  ADD_RELATIONSHIP({ commit, state }, { firstTable, secondTable }) {
    const firstTableName = getTableName(firstTable)
    const secondTableName = getTableName(secondTable)

    if (state.relationshipsMap[firstTableName].indexOf(secondTableName) >= 0) {
      // already exists, do nothing
      return
    }
    commit('ADD_RELATIONSHIP', { firstTableName, secondTableName })
  }
}
