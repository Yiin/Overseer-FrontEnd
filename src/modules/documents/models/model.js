class Model {
  constructor(props) {
    this.fill(props)
  }

  fill(props) {
    for (let key in props) {
      this[key] = props[key]
    }
  }
}

export default Model
