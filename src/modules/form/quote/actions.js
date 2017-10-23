import FormActions from '../base/actions'
import Quote from '@/modules/documents/models/quote'

export default FormActions({
  model: Quote,
  repository: 'documents/repositories/quote'
}, {
  SET_FORM_DATA({ commit }, data) {
    commit('SET_FORM_DATA', data)

    if (data.items) {
      commit('SET_ITEMS', data.items)
    }
  }
})
