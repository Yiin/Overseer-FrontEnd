import Model from './model'

/**
 * Timezone model
 */
class Timezone extends Model {
  static create(data) {
    return new Timezone({
      id: data.id,
      name: data.name,
      location: data.location
    })
  }
}

export default Timezone
