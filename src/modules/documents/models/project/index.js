import { mix } from 'mixwith'
import Document from '../document'
import BelongsToCompany from '../concerns/belongs-to-company'
import ProjectSchema from './schema'
import ProjectFaker from './faker'

class Project extends mix(Document).with(ProjectSchema, ProjectFaker, BelongsToCompany) {
  static create(data) {
    return new this(this.parse(data))
  }
}

export default Project
