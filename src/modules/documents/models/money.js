import { ObjectModel, FunctionModel } from 'objectmodel'
import { methods as CurrencyRepository } from '../repositories/currency'
import Currency from './currency'
import fx from 'money'

/**
 * Money model
 * @type {ObjectModel}
 */
const Money = new ObjectModel({
  currency: Currency,
  amount: Number
})

Money.create = function (data) {
  return new Money({
    currency: CurrencyRepository.findOrCreate(data.currency),
    amount: Number(data.amount)
  })
}

Money.prototype.getAmountIn = FunctionModel(Currency).return(Number)(
  function (currency) {
    return fx(this.amount).from(this.currency.code || 'EUR').to(currency.code)
  }
)
export default Money
