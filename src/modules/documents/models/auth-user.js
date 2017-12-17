import _ from 'lodash'
import router from '@/router'
import store from '@/store'
import User from './user'
import { methods as CompanyRepository } from '../repositories/company'
import { methods as CurrencyRepository } from '../repositories/currency'

class AuthUser extends User {
  static parse(data) {
    return {
      ...super.parse(data),

      company: data.state && data.state.company_uuid
        ? CompanyRepository.find(data.state.company_uuid)
        : CompanyRepository.first(),

      state: data.state,
      settings: data.settings,
      preferences: data.preferences
    }
  }

  getSelf() {
    return {
      'client': require('../repositories/client').methods,
      'employee': require('../repositories/employee').methods
    }[this.authenticableType].findByKey(this.authenticableId)
  }

  init() {
    if (typeof super.init === 'function') {
      super.init()
    }

    let previous = _.cloneDeep(this)

    store.watch(() => {
      return store.state.auth.user
    }, () => {
      /**
       * Update documents, remove unaccessable ones
       * and fetch missing.
       */
      this.updateDocuments(previous)

      /**
       * Update states, i.e. taskbar, overview selections
       */
      // this.updateStates()

      /**
       * Redirect to index if we're not authorized to see the page we're in
       */
      if (router.currentRoute.meta && typeof router.currentRoute.meta.authorize === 'function') {
        if (!router.currentRoute.meta.authorize()) {
          router.push('/')
        }
      }

      previous = _.cloneDeep(this)
    }, {
      deep: true
    })
  }

  updateStates() {
    if (!this.state) {
      return
    }

    if (this.state.overview) {
      if ('showGraphs' in this.state.overview) {
        store.dispatch('dashboard/SHOW_GRAPHS', this.state.overview.showGraphs)
      }

      if (this.state.overview.currencyCode) {
        const currency = CurrencyRepository.findByKey(this.state.overview.currencyCode)

        if (currency) {
          store.dispatch('dashboard/CHANGE_CURRENCY', currency)
        }
      }

      if (this.state.overview.dateRange) {
        store.dispatch('dashboard/CHANGE_DATE_RANGE', this.state.overview.dateRange)
      }

      if (this.state.overview.dateRangeKey) {
        store.dispatch('dashboard/UPDATE_DATE_RANGE_KEY', this.state.overview.dateRangeKey)
      }
    }
  }
}

export default AuthUser
