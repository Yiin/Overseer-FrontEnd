import { methods as ClientRepository } from '../../repositories/client'

const ProjectSchema = (superclass) => class extends superclass {

  static parse(data) {
    const modelData = super.parse(data)

    modelData.name = data.name
    modelData.client = ClientRepository.findByKey(data.client_uuid)
    modelData.description = data.description
    modelData.taskLists = [] // data.taskLists.map(TaskListRepository.findOrCreate)
    modelData.tasks = [] // data.tasks.map(TaskRepository.findOrCreate)

    return modelData
  }

  serialize(options = {}) {
    return Object.assign(super.serialize(options), {
      name: this.name,
      client_uuid: (this.client || null) && this.client.uuid,
      description: this.description
    })
  }
}

export default ProjectSchema
