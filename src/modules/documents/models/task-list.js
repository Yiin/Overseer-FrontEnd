import Document from './document'
import { StringNotBlank } from './common'
import { methods as TaskRepository } from '../repositories/task'

const TaskList = Document.extend({
  name: StringNotBlank,
  color: String
})

/**
 * Constructor
 */
TaskList.create = Document.create.bind(TaskList)

TaskList.parse = function (data) {
  const modelData = {}

  modelData.name = data.name
  modelData.color = data.color
  modelData.tasks = data.tasks.map(TaskRepository.findOrCreate)

  return modelData
}

TaskList.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    color: this.color
  }
}

export default TaskList
