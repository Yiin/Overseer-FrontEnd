import { uuid, text } from './data-types'

export default (project) => {
  return {
    project: {
      client_uuid: uuid(project.client_uuid),
      name: text(project.name),
      description: text(project.description)
    }
  }
}
