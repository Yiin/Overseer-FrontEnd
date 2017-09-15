import FormActions from '@/modules/form/actions'

export default FormActions({
  SET_FORM_DATA({ commit }, data) {
    commit('SET_FORM_DATA', data)
    commit('SET_ITEMS', data.items)
  }
})
