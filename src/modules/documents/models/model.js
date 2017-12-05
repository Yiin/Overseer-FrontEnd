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
}

export default Model
