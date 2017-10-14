import Api from '@/api'
import i18n from '@/i18n'

export default {
  SET_SETTINGS({ commit, rootState }, settings) {
    const currency = rootState.passive.currencies.find((currency) => {
      return currency.code === settings.currency_code
    })
    if (currency) {
      commit('SET_CURRENCY', currency)
    }

    if (settings.locale) {
      i18n.locale = settings.locale
      commit('SET_LOCALE', settings.locale)
    }
  },

  CHANGE_CURRENCY({ commit, rootState }, currencyCode) {
    const currency = rootState.passive.currencies.find((currency) => {
      return currency.code === currencyCode
    })
    commit('SET_CURRENCY', currency)

    Api.post('settings/currency', {
      currencyCode
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
