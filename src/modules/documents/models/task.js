import Document from './document'
import { StringNotBlank } from './common'

const Task = Document.extend({
  name: StringNotBlank,
  isCompleted: Boolean
})

/**
 * Constructor
 */
Task.create = Document.create.bind(Task)

Task.parse = function (data) {
  const modelData = {}

  modelData.name = data.name
  modelData.isCompleted = data.is_completed

  return modelData
}

Task.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    is_completed: this.isCompleted
  }
}

export default Task
