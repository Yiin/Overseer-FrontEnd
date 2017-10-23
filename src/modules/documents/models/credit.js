import Document from './document'
import { methods as ClientRepository } from '../repositories/client'
import { methods as CurrencyRepository } from '../repositories/currency'
import moment from 'moment'
import Client from './client'
import Money from './money'

/**
 * Credit model
 * @type {ObjectModel}
 */
const Credit = Document.extend({
  client: Client,
  amount: Money,
  creditDate: moment,
  creditNumber: String
})

/**
 * Constructor
 */
Credit.create = Document.create.bind(Credit)

/**
 * Parse credit data that came from api
 */
Credit.parse = function (data) {
  const modelData = {}

  modelData.client = ClientRepository.findOrCreate(data.client)
  modelData.amount = Money.create({
    amount: data.amount,
    currency: CurrencyRepository.findOrCreate(data.currency)
  })
  modelData.balance = Money.create({
    amount: data.balance,
    currency: CurrencyRepository.findOrCreate(data.currency)
  })
  modelData.creditDate = data.credit_date && moment(data.credit_date.date)
  modelData.creditNumber = data.credit_number

  return modelData
}

Credit.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    client_uuid: this.client.uuid,
    amount: this.amount.amount,
    currency_code: this.amount.currency.code,
    credit_date: this.creditDate.format('YYYY-MM-DD'),
    credit_number: this.creditNumber
  }
}

export default Credit
