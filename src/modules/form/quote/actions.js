import FormActions from '@/modules/form/actions'

export default FormActions({
  SET_FORM_DATA({ commit }, data) {
    commit('SET_FORM_DATA', data)

    if (data.items) {
      commit('SET_ITEMS', data.items)
    }
  }
})
