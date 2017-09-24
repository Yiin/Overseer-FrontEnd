import Api from '@/api'

export default {
  CHANGE_CURRENCY({ commit }, currencyId) {
    commit('CHANGE_CURRENCY', currencyId)

    Api.post('settings/currency', {
      currencyId
    })
  }
}
