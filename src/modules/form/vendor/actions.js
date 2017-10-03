import FormActions from '@/modules/form/actions'

export default FormActions({
  ADD_NEW_CONTACT({ commit }) {
    commit('ADD_NEW_CONTACT')
  },

  REMOVE_CONTACT({ commit }, index) {
    commit('REMOVE_CONTACT', index)
  }
})
