import { BasicModel } from 'objectmodel'
import moment from 'moment'
import Api from '@/api'
import Model from './model'

/**
 * Vat number statuses
 */
const VatStatus = new BasicModel([
  'valid',
  'pending',
  'invalid'
])

/**
 * Vat number info
 */
class VatInfo extends Model {
  static create(data) {
    return new VatInfo({
      countryCode: data.country_code,
      number: data.number,
      companyName: data.name,
      address: data.address,
      status: data.status,
      message: data.status,
      checkedAt: data.created_at ? moment(data.created_at.date) : moment()
    })
  }
}

/**
 * Dynamic import
 *
 * TODO: learn how to deal with recursive imports?
 */
function getVatInfoRepositoryMethods() {
  if (typeof getVatInfoRepositoryMethods.repositoryMethods === 'undefined') {
    getVatInfoRepositoryMethods.repositoryMethods = require('../repositories/vat-info').methods
  }
  return getVatInfoRepositoryMethods.repositoryMethods
}

/**
 * Vat number model
 */
class Vat extends Model {
  /**
   * Parse vat number data that came from API
   */
  static create(vatNumber, { data: vatChecks = [] } = {}) {
    getVatInfoRepositoryMethods().addItems(vatChecks)

    return new Vat({
      vatNumber,
      countryCode: vatNumber ? vatNumber.substring(0, 2) : '',
      number: vatNumber ? vatNumber.substring(2) : ''
    })
  }

  /**
   * Check vat number
   */
  check() {
    return Api.post('feature/vat-checker/check', {
      cc: this.countryCode,
      vn: this.number
    }).then((response) => {
      getVatInfoRepositoryMethods().addItem(response)
      return response
    })
  }

  getLatestInfo() {
    const info = getVatInfoRepositoryMethods().findMany({
      countryCode: this.countryCode,
      number: this.number
    }).reduce((latest, current) => {
      return latest && latest.checkedAt.isAfter(current.checkedAt) ? latest : current
    }, null)

    if (info) {
      return info
    } else {
      return new VatInfo({
        'countryCode': this.countryCode,
        'number': this.number,
        'status': 'pending'
      })
    }
  }
}

export {
  VatStatus,
  VatInfo
}
export default Vat
