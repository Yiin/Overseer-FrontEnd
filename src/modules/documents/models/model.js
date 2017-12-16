class Model {
  constructor(props) {
    this.fill(props)
    if (typeof this.init === 'function') {
      this.init()
    }
  }

  fill(props) {
    for (let key in props) {
      this[key] = props[key]
    }
  }

  update(data) {
    this.fill(
      this.constructor.parse(data)
    )
    return this
  }
}

export default Model
