import { ObjectModel } from 'objectmodel'

/**
 * Currency model
 * @type {ObjectModel}
 */
const Currency = new ObjectModel({
  code: String,
  name: String,
  symbol: [String]
})

Currency.create = function (data) {
  return new Currency({
    code: data.code,
    name: data.name,
    symbol: data.symbol
  })
}

export default Currency
