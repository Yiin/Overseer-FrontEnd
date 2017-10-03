import Api from '@/api'

export default {
  LOAD_STATIC_DATA({ commit }) {
    return Api.get('static-data')
      .then((response) => {
        commit('SET_STATIC_DATA', response)
        return response
      })
  },

  SET_STATIC_DATA({ commit }, data) {
    commit('SET_STATIC_DATA', data)
  }
}
