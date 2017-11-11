import Api from '@/api'
import i18n from '@/i18n'
import fx from 'money'
import { methods as CurrencyRepository } from '@/modules/documents/repositories/currency'

export default {
  SET_SETTINGS({ dispatch, commit, rootState }, settings) {
    dispatch('CHANGE_CURRENCY', {
      currency: settings.currency || settings.currency_code,
      save: false
    })

    if (settings.locale) {
      i18n.locale = settings.locale
      commit('SET_LOCALE', settings.locale)
    }
  },

  CHANGE_CURRENCY({ commit, rootState }, {
    currency,
    save = true
  }) {
    const foundCurrency = typeof currency === 'string'
      ? CurrencyRepository.findByKey(currency)
      : CurrencyRepository.find(currency)

    if (!foundCurrency) {
      console.log('couldnt find settings currency', foundCurrency, currency)
      return
    }

    fx.base = foundCurrency.code
    fx.rates = foundCurrency.rates

    commit('SET_CURRENCY', foundCurrency)

    if (save) {
      Api.post('settings/currency', {
        currencyCode: foundCurrency.code
      })
    }
  },

  CHANGE_LOCALE({ commit }, locale) {
    i18n.locale = locale
    commit('SET_LOCALE', locale)

    Api.post('settings/locale', {
      locale
    })
  }
}
