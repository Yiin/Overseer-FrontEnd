import { ObjectModel } from 'objectmodel'

/**
 * Timezone model
 * @type {ObjectModel}
 */
const Timezone = new ObjectModel({
  id: Number,
  name: String,
  location: String
})

/**
 * Parse company size data that came from api
 */
Timezone.parse = function (data) {
  const modelData = {}

  modelData.id = data.id
  modelData.name = data.name
  modelData.location = data.location

  return modelData
}

Timezone.create = function (data) {
  return new Timezone(Timezone.parse(data))
}

export default Timezone
