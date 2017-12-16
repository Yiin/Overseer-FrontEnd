import FormActions from '../base/actions'
import Credit from '@models/credit'

export default FormActions({
  model: Credit,
  repository: 'documents/repositories/credit'
}, {
  ADD_NEW_CONTACT({ commit }) {
    commit('ADD_NEW_CONTACT')
  }
})
