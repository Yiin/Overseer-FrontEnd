import moment from 'moment'
import Model from './model'
import Money from './money'
import { methods as CreditRepository } from '../repositories/credit'
import { methods as CurrencyRepository } from '../repositories/currency'

/**
 * Applied credit model
 */
class AppliedCredit extends Model {
  static create(data) {
    const currency = CurrencyRepository.findByKey(data.currency_code)

    return new AppliedCredit({
      credit: CreditRepository.findByKey(data.credit_uuid),
      currency,
      amount: Money.create({
        amount: data.amount,
        currency
      }),
      date: data.created_at && moment(data.created_at.date)
    })
  }

  serialize() {
    return {
      credit_uuid: this.credit.uuid,
      amount: this.amount.amount,
      currency_code: this.currency.code
    }
  }
}

export default AppliedCredit
