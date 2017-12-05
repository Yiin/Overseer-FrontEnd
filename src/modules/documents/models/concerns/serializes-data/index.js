/**
 * Contains a method that serializes data
 * using 'serialize' method from superclass
 * or parsing as json if method is not available.
 */
const SerializesData = (superclass) => class extends superclass {
  static serializeData(data, options = {}) {
    if (data instanceof this) {
      if (typeof data.serialize === 'function') {
        return data.serialize(options)
      } else {
        return JSON.parse(JSON.stringify(data))
      }
    } else {
      return this.serializeData(this.create(data), options)
    }
  }
}

export default SerializesData
