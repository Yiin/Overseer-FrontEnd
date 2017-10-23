import FormActions from '../base/actions'
import Invoice from '@/modules/documents/models/invoice'

export default FormActions({
  model: Invoice,
  repository: 'documents/repositories/invoice'
}, {
  SET_FORM_DATA({ commit }, data) {
    commit('SET_FORM_DATA', data)
    if (data.items) {
      commit('SET_ITEMS', data.items)
    }
  }
})
