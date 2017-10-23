import FormActions from '../base/actions'

export default FormActions({
  SET_FORM_DATA({ commit }, data) {
    if (data.frequency) {
      [data.frequency_value, data.frequency_type] = data.frequency.split(':')
    }
    commit('SET_FORM_DATA', data)

    if (data.items) {
      commit('SET_ITEMS', data.items)
    }
  }
})
