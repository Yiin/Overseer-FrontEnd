import Document from './document'
import { methods as TaskRepository } from '../repositories/task'

class TaskList extends Document {
  static create(data) {
    return new this(this.parse(data))
  }

  static parse(data) {
    const parsedData = super.parse(data)

    parsedData.name = data.name
    parsedData.color = data.color
    parsedData.tasks = data.tasks.map(TaskRepository.findOrCreate)

    return parsedData
  }

  serialize() {
    return {
      uuid: this.uuid,
      name: this.name,
      color: this.color
    }
  }
}

export default TaskList
