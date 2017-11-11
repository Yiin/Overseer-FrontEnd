import Document from './document'
import CreditTransformer from '../transformers/credit'
import { methods as ClientRepository } from '../repositories/client'
import { methods as CurrencyRepository } from '../repositories/currency'
import moment from 'moment'
import Money from './money'

/**
 * Credit model
 */
class Credit extends Document {
  static create(data) {
    return new this(this.parse(data))
  }

  getTitle() {
    return this.creditNumber
  }

  /**
   * Parse credit data that came from api
   */
  static parse(data) {
    const modelData = super.parse(data)

    modelData.client = ClientRepository.findByKey(data.client_uuid)

    const currency = CurrencyRepository.findOrDefault(data.currency)

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
    modelData.creditNumber = data.credit_number

    return modelData
  }

  static transformProps(...props) {
    return CreditTransformer(...props)
  }

  serialize() {
    return {
      uuid: this.uuid,
      client_uuid: this.client.uuid,
      balance: this.balance.amount,
      currency_code: this.amount.currency.code,
      credit_date: this.creditDate.format('YYYY-MM-DD'),
      credit_number: this.creditNumber
    }
  }
}

export default Credit
