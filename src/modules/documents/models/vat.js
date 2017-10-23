import { ObjectModel } from 'objectmodel'

/**
 * Vat number model
 * @type {ObjectModel}
 */
const Vat = new ObjectModel({
  vatNumber: [String],
  cc: [String],
  number: [String]
})

/**
 * Parse vat number data that came from API
 */
Vat.create = function (vatNumber) {
  return new Vat({
    vatNumber,
    cc: vatNumber ? vatNumber.substring(0, 2) : undefined,
    number: vatNumber ? vatNumber.substring(2) : undefined
  })
}

export default Vat
