import Model from './model'
import { methods as CurrencyRepository } from '../repositories/currency'
import Currency from './currency'
import fx from 'money'
import accounting from 'accounting'

export const DEFAULT_PRECISION = 2

/**
 * Money model
 */
class Money extends Model {
  static create(data) {
    return new Money({
      currency: CurrencyRepository.findByKey(data.currency.code),
      amount: accounting.toFixed(accounting.unformat(data.amount || 0), DEFAULT_PRECISION)
    })
  }

  static convertCurrency(amount, from, to, precision) {
    const fromCurrencyCode = from instanceof Currency
      ? from.code
      : from

    const toCurrencyCode = to instanceof Currency
      ? to.code
      : to

    if (fromCurrencyCode === toCurrencyCode) {
      return amount
    }

    return accounting.toFixed(
      accounting.unformat(
        fx.convert(amount, {
          from: fromCurrencyCode || 'EUR',
          to: toCurrencyCode
        })
      ), precision
    )
  }

  static toFixed(number, precision = DEFAULT_PRECISION) {
    return accounting.toFixed(number, precision)
  }

  static formatNumber(number, precision = DEFAULT_PRECISION) {
    return accounting.formatNumber(number, precision)
  }

  static formatMoney(number, currencySymbol, precision = DEFAULT_PRECISION) {
    return accounting.formatMoney(number, currencySymbol, precision)
  }

  /**
   * Set amount
   */
  set(value) {
    if (value instanceof Money) {
      this.amount = value.getIn(this.currency)
    } else if (typeof value === 'string') {
      this.amount = accounting.unformat(value)
    } else if (typeof value === 'number') {
      this.amount = value
    } else {
      throw new Error('Invalid value passed to Model.set method.')
    }
  }

  /**
   * Adjust amount
   */
  adjust(difference) {
    if (difference instanceof Money) {
      this.amount += difference.getIn(this.currency)
    } else if (typeof difference === 'string') {
      this.amount += accounting.unformat(difference)
    } else {
      this.amount += difference
    }
  }

  /**
   * Get amount
   */
  get(precision = DEFAULT_PRECISION) {
    return accounting.unformat(accounting.toFixed(this.amount, precision))
  }

  /**
   * Get amount in specified currency
   */
  getIn(currency, precision = DEFAULT_PRECISION) {
    return Money.convertCurrency(this.amount, this.currency, currency, precision)
  }

  /**
   * Get formated amount
   */
  formatAmount(precision = DEFAULT_PRECISION) {
    return accounting.formatNumber(this.amount, precision)
  }

  format(precision = DEFAULT_PRECISION) {
    return accounting.formatMoney(this.amount, this.currency.symbol, precision)
  }
}

export default Money
