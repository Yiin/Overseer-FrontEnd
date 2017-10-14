import Api from '@/api'

export default {
  LOAD_RESULTS() {
    // Api.get('feature/vat-checker/results')
    //   .then(() => {
    //     commit('SET_RESULTS', response)
    //   })
  },

  CHECK_VAT({ commit }, { country_code, number }) {
    return Api.post('feature/vat-checker/check', {
      cc: country_code,
      vn: number
    }).then((response) => {
      commit('ADD_RESULT', response)
      return response
    })
  },

  REMOVE_CHECKS({ commit }, { country_code, number }) {
    commit('REMOVE_RESULTS', { country_code, number })
  }
}
