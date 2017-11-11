import Model from './model'

class Country extends Model {
  static create(data) {
    return new Country(Country.parse(data))
  }

  /**
   * Parse country data that came from api
   */
  static parse(data) {
    const modelData = {}

    modelData.id = data.id
    modelData.name = data.name
    modelData.capital = data.capital
    modelData.citizenship = data.citizenship
    modelData.countryCode = data.country_code
    modelData.fullName = data.full_name
    modelData.iso_3166_2 = data.iso_3166_2
    modelData.iso_3166_3 = data.iso_3166_3

    return modelData
  }
}

export default Country
