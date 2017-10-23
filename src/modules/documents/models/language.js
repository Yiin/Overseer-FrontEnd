import { ObjectModel } from 'objectmodel'

/**
 * Language model
 * @type {ObjectModel}
 */
const Language = new ObjectModel({
  id: Number,
  name: String,
  locale: String
})

Language.create = function (data) {
  return new Language({
    id: data.id,
    name: data.name,
    locale: data.locale
  })
}

export default Language
