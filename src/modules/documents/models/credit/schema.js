import moment from 'moment'
import { mix } from 'mixwith'
import DocumentSchema from '../document/schema'
import { methods as CurrencyRepository } from '../../repositories/currency'
import { methods as ClientRepository } from '../../repositories/client'
import Money from '../money'

const CreditSchema = (superclass) => class extends mix(superclass).with(DocumentSchema) {
  /**
   * Parse credit data that came from api
   */
  static parse(data) {
    const modelData = super.parse(data)

    modelData.client = ClientRepository.findByKey(data.client_uuid)

    const currency = CurrencyRepository.findByKey(data.currency_code)

    modelData.currency = currency
    modelData.amount = Money.create({
      amount: data.amount,
      currency
    })

    modelData.balance = Money.create({
      amount: data.balance,
      currency
    })

    modelData.creditDate = data.credit_date && moment(data.credit_date.date)
    modelData.creditNumber = data.credit_number || ''

    return modelData
  }

  serialize(options = {}) {
    return Object.assign(super.serialize(options), {
      client_uuid: this.client.uuid,
      balance: this.balance.amount,
      currency_code: this.amount.currency.code,
      credit_date: this.creditDate.format('YYYY-MM-DD'),
      credit_number: this.creditNumber
    })
  }
}

export default CreditSchema
