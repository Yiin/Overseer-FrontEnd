import Document from './document'

class Task extends Document {
  static create(data) {
    return new this(this.parse(data))
  }

  static parse(data) {
    const modelData = Document.parse(data)

    modelData.name = data.name
    modelData.isCompleted = data.is_completed

    return modelData
  }

  serialize(options = {}) {
    return {
      uuid: options.fresh ? null : this.uuid,
      name: this.name,
      is_completed: this.isCompleted
    }
  }
}

export default Task
