import FormActions from '../base/actions'
import Project from '@/modules/documents/models/project'

export default FormActions({
  model: Project,
  repository: 'documents/repositories/project'
})
