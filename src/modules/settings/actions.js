import Api from '@/api'
import i18n from '@/i18n'

export default {
  SET_SETTINGS({ commit, rootState }, settings) {
    const currency = rootState.passive.currencies.find((currency) => {
      return currency.id === settings.currency_id
    })
    if (currency) {
      commit('SET_CURRENCY', currency)
    }

    if (settings.locale) {
      i18n.locale = settings.locale
      commit('SET_LOCALE', settings.locale)
    }
  },

  CHANGE_CURRENCY({ commit, rootState }, currencyId) {
    const currency = rootState.passive.currencies.find((currency) => {
      return currency.id === currencyId
    })
    commit('SET_CURRENCY', currency)

    Api.post('settings/currency', {
      currencyId
    })
  },

  CHANGE_LOCALE({ commit }, locale) {
    i18n.locale = locale
    commit('SET_LOCALE', locale)

    Api.post('settings/locale', {
      locale
    })
  }
}
