import Model from './model'

/**
 * Industry model
 */
class Industry extends Model {
  static create(data) {
    return new Industry({
      id: data.id,
      name: data.name
    })
  }
}

export default Industry
