import Model from './model'

/**
 * CompanySize model
 */
class CompanySize extends Model {
  static create(data) {
    return new CompanySize(CompanySize.parse(data))
  }

  /**
   * Parse company size data that came from api
   */
  static parse(data) {
    const modelData = {}

    modelData.id = data.id
    modelData.name = data.name

    return modelData
  }
}

export default CompanySize
