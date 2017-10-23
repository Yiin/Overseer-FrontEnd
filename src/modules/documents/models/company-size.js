import { ObjectModel } from 'objectmodel'

/**
 * CompanySize model
 * @type {ObjectModel}
 */
const CompanySize = new ObjectModel({
  id: Number,
  name: String
})

/**
 * Parse company size data that came from api
 */
CompanySize.parse = function (data) {
  const modelData = {}

  modelData.id = data.id
  modelData.name = data.name

  return modelData
}

CompanySize.create = function (data) {
  return new CompanySize(CompanySize.parse(data))
}

export default CompanySize
