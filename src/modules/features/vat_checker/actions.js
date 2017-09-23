import Api from '@/api'

export default {
  LOAD_RESULTS({ commit }) {
    Api.get('feature/vat-checker/results')
      .then((response) => {
        commit('SET_RESULTS', response)
      })
  },

  CHECK_VAT({ commit }, { country_code, number }) {
    Api.post('feature/vat-checker/check', {
      cc: country_code,
      vn: number
    }).then((response) => {
      commit('ADD_RESULT', response)
    })
  }
}
