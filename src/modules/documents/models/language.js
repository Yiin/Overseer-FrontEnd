import Model from './model'

/**
 * Language model
 */
class Language extends Model {
  static create(data) {
    return new Language({
      id: data.id,
      name: data.name,
      locale: data.locale
    })
  }
}

export default Language
