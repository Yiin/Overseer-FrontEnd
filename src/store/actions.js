// import { default as store, getInitialState } from '@/store'
import Echo from '@/echo'
// import cryptojs from 'crypto-js'
// import CJSON from 'circular-json'

export default {
  // ENCRYPT({ commit, state }) {
    // const stringifiedState = CJSON.stringify(state)
    // const encryptedData = cryptojs.AES.encrypt(stringifiedState, '0000').toString()

    // store.replaceState(Object.assign(getInitialState([
    //   'auth',
    //   'documents'
    // ]), {
    //   auth: state.auth,
    //   documents: state.documents
    // }))

    // commit('SET_ENCRYPTED', encryptedData)
  // },

  // DECRYPT({ commit, state }, code = '0000') {
    // const decryptedState = cryptojs.AES.decrypt(state.encryptedData, code).toString(cryptojs.enc.Utf8)
    // const parsed = CJSON.parse(decryptedState)

    // store.replaceState(parsed)

    // commit('CLEAR_ENCRYPTED')
  // },

  PRELOAD_DATA({ commit }, preloadedData) {
    const preloadedJsonEl = document.getElementById('preloaded_json')

    if (!preloadedData && preloadedJsonEl) {
      preloadedData = JSON.parse(preloadedJsonEl.innerHTML)
      preloadedJsonEl.parentNode.removeChild(preloadedJsonEl)
    }

    commit('SET_PRELOADED_DATA', preloadedData)
  },

  INIT({ dispatch, commit, state }, preloadedData = null) {
    if (state.preloadedData && state.preloadedData.user && state.preloadedData.user.taskbar) {
      commit('taskbar/SET_STATE', JSON.parse(state.preloadedData.user.taskbar), { root: true })
    }

    // Use preloaded data if possible, load everything if not
    if (preloadedData) {
      const data = preloadedData

      /* Initiate static data */
      dispatch('documents/repositories/currency/SET_ITEMS', data.passive.currencies)
      dispatch('documents/repositories/country/SET_ITEMS', data.passive.countries)
      dispatch('documents/repositories/companySize/SET_ITEMS', data.passive.companySizes)
      dispatch('documents/repositories/industry/SET_ITEMS', data.passive.industries)
      dispatch('documents/repositories/language/SET_ITEMS', data.passive.languages)
      dispatch('documents/repositories/timezone/SET_ITEMS', data.passive.timezones)
      dispatch('documents/repositories/paymentType/SET_ITEMS', data.passive.paymentTypes)

      /**
       * Update user settings
       */
      dispatch('settings/SET_SETTINGS', state.auth.user.settings)

      /**
       * The order is kind of important.
       *
       * Try to first set parent documents, and only then their children.
       */
      dispatch('documents/repositories/product/SET_ITEMS', data.documents.product)
      dispatch('documents/repositories/client/SET_ITEMS', data.documents.client)
      dispatch('documents/repositories/credit/SET_ITEMS', data.documents.credit)
      dispatch('documents/repositories/invoice/SET_ITEMS', data.documents.invoice)
      dispatch('documents/repositories/recurringInvoice/SET_ITEMS', data.documents['recurring-invoice'])
      dispatch('documents/repositories/payment/SET_ITEMS', data.documents.payment)
      dispatch('documents/repositories/quote/SET_ITEMS', data.documents.quote)
      dispatch('documents/repositories/vendor/SET_ITEMS', data.documents.vendor)
      dispatch('documents/repositories/expense/SET_ITEMS', data.documents.expense)
      dispatch('documents/repositories/project/SET_ITEMS', data.crm.projects)

      dispatch('documents/repositories/activity/SET_ITEMS', data.system.activityLog)
      // dispatch('system/SET_ACTIVITY_LOG', data.system.activityLog)
    }

    /* Real time updates */
    Echo.connect()
  }
}
