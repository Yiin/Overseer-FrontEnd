import Document from './document'

/**
 * TaxRate model
 */
class TaxRate extends Document {
  static create(data) {
    return new this(this.parse(data))
  }

  /**
   * Parse tax rate data that came from API
   */
  static parse(data) {
    const modelData = super.parse(data)

    modelData.name = data.name
    modelData.rate = Number(data.rate)
    modelData.isInclusive = Boolean(data.is_inclusive)

    return modelData
  }
}

export default TaxRate
