import Document from './document'
import { StringNotBlank } from './common'

/**
 * TaxRate model
 * @type {ObjectModel}
 */
const TaxRate = Document.extend({
  name: StringNotBlank,
  rate: Number,
  isInclusive: Boolean
}).defaults({
  isInclusive: false
})

/**
 * Parse tax rate data that came from API
 */
TaxRate.parse = function (data) {
  const modelData = {}

  modelData.name = data.name
  modelData.rate = Number(data.rate)
  modelData.isInclusive = Boolean(data.is_inclusive)

  return modelData
}
TaxRate.create = Document.create.bind(TaxRate)

export default TaxRate
