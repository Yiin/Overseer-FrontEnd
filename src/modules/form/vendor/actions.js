import FormActions from '../base/actions'
import Vendor from '@models/vendor'

export default FormActions({
  model: Vendor,
  repository: 'documents/repositories/vendor'
}, {
  ADD_NEW_CONTACT({ commit }) {
    commit('ADD_NEW_CONTACT')
  },

  REMOVE_CONTACT({ commit }, index) {
    commit('REMOVE_CONTACT', index)
  }
})
