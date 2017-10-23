import { ObjectModel } from 'objectmodel'

const Country = new ObjectModel({
  id: Number,
  name: String,
  capital: [String],
  citizenship: String,
  countryCode: String,
  fullName: [String],
  iso_3166_2: String,
  iso_3166_3: String
})

/**
 * Parse country data that came from api
 */
Country.parse = function (data) {
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

Country.create = function (data) {
  return new Country(Country.parse(data))
}

export default Country
