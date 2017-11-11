import Document from './document'
import ProjectTransformer from '../transformers/project'
import { methods as ClientRepository } from '../repositories/client'

class Project extends Document {
  static create(data) {
    return new this(this.parse(data))
  }

  static parse(data) {
    const modelData = super.parse(data)

    modelData.name = data.name
    modelData.client = ClientRepository.findByKey(data.client_uuid)
    modelData.description = data.description
    modelData.taskLists = [] // data.taskLists.map(TaskListRepository.findOrCreate)
    modelData.tasks = [] // data.tasks.map(TaskRepository.findOrCreate)

    return modelData
  }

  static transformProps(...props) {
    return ProjectTransformer(...props)
  }

  serialize() {
    return {
      uuid: this.uuid,
      name: this.name,
      client_uuid: (this.client || null) && this.client.uuid,
      description: this.description
    }
  }
}

export default Project
