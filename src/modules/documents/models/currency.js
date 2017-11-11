import Model from './model'

/**
 * Currency model
 */
class Currency extends Model {
  static create(data) {
    const rates = {}

    data.rates.forEach((rate) => {
      rates[rate.to] = rate.rate
    })

    return new Currency({
      code: data.code,
      name: data.name,
      symbol: data.symbol,
      rates
    })
  }
}

export default Currency
