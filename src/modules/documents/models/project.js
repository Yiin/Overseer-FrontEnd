import { ArrayModel } from 'objectmodel'
import Document from './document'
import { StringNotBlank } from './common'
import { methods as ClientRepository } from '../repositories/client'
import { methods as TaskListRepository } from '../repositories/task-list'
import { methods as TaskRepository } from '../repositories/task'
import Client from './client'
import TaskList from './task-list'
import Task from './task'

const Project = Document.extend({
  name: StringNotBlank,
  client: [Client],
  description: [String],
  taskLists: ArrayModel(TaskList),
  tasks: ArrayModel(Task)
})

/**
 * Constructor
 */
Project.create = Document.create.bind(Project)

Project.parse = function (data) {
  const modelData = {}

  modelData.name = data.name
  modelData.client = ClientRepository.findOrCreate(data.client)
  modelData.description = data.description
  modelData.taskLists = [] // data.taskLists.map(TaskListRepository.findOrCreate)
  modelData.tasks = [] // data.tasks.map(TaskRepository.findOrCreate)

  return modelData
}

Project.prototype.serialize = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    client_uuid: this.client.uuid,
    description: this.description
  }
}

export default Project
