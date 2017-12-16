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
    // Use preloaded data if possible, load everything if not
    if (preloadedData) {
      if ('data' in preloadedData) {
        const data = preloadedData.data

        /* Initiate static data */
        dispatch('documents/repositories/currency/SET_ITEMS', data.passive.currencies)
        dispatch('documents/repositories/country/SET_ITEMS', data.passive.countries)
        dispatch('documents/repositories/companySize/SET_ITEMS', data.passive.companySizes)
        dispatch('documents/repositories/industry/SET_ITEMS', data.passive.industries)
        dispatch('documents/repositories/language/SET_ITEMS', data.passive.languages)
        dispatch('documents/repositories/timezone/SET_ITEMS', data.passive.timezones)
        dispatch('documents/repositories/paymentType/SET_ITEMS', data.passive.paymentTypes)

        /**
         * Load companies
         */
        dispatch('documents/repositories/company/SET_ITEMS', preloadedData.data.companies, { root: true })
        dispatch('documents/repositories/employee/ADD_ITEMS', preloadedData.data.companies.reduce((employees, company) => {
          return employees.concat(company.employees)
        }, []), { root: true })

        /**
         * Load Clients before we load user
         */
        dispatch('documents/repositories/client/SET_ITEMS', data.documents.client)
      }

      /**
       * Set account data
       */
      if ('account' in preloadedData) {
        commit('auth/SET_ACCOUNT', preloadedData.account)
      }

      /**
       * Set user data
       */
      if ('user' in preloadedData) {
        dispatch('auth/SET_USER', preloadedData.user)

        /**
         * Update user settings
         */
        dispatch('settings/SET_SETTINGS', state.auth.user.settings)

        /**
         * Saved taskbar state
         */
        if (preloadedData.user.taskbar) {
          commit('taskbar/SET_STATE', JSON.parse(preloadedData.user.taskbar), { root: true })
        }
      }

      if ('data' in preloadedData) {
        const data = preloadedData.data

        /**
         * The order is important.
         *
         * Try to first set parent documents, and only then their children.
         */
        dispatch('documents/repositories/product/SET_ITEMS', data.documents.product)
        dispatch('documents/repositories/credit/SET_ITEMS', data.documents.credit)
        dispatch('documents/repositories/invoice/SET_ITEMS', data.documents.invoice)
        dispatch('documents/repositories/payment/SET_ITEMS', data.documents.payment)
        dispatch('documents/repositories/quote/SET_ITEMS', data.documents.quote)
        dispatch('documents/repositories/vendor/SET_ITEMS', data.documents.vendor)
        dispatch('documents/repositories/expense/SET_ITEMS', data.documents.expense)
        dispatch('documents/repositories/project/SET_ITEMS', data.crm.projects)

        dispatch('documents/repositories/activity/SET_ITEMS', data.system.activityLog)
        dispatch('system/SET_ACTIVITY_LOG', data.system.activityLog)
      }
    }

    commit('SET_PRELOADED_DATA', {})

    /* Real time updates */
    Echo.connect()
  }
}
