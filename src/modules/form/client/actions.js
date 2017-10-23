import FormActions from '../base/actions'
import Client from '@/modules/documents/models/client'

export default FormActions({
  model: Client,
  repository: 'documents/repositories/client'
}, {
  ADD_NEW_CONTACT({ commit }) {
    commit('ADD_NEW_CONTACT')
  },

  REMOVE_CONTACT({ commit }, index) {
    commit('REMOVE_CONTACT', index)
  }
})
