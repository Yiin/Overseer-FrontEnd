import Api from '@/api'

export default {
  LOAD_STATIC_DATA({ commit }) {
    Api.get('static-data')
      .then((response) => {
        commit('SET_STATIC_DATA', response)
      })
  }
}
