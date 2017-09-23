import i18n from '@/i18n'
import {
  archiveDocument,
  restoreDocument
} from '@/modules/documents/actions'
import Statuses from './index'

function checkForGenericConflicts(document, documentType, status) {
  const conflicts = []

  // unarchive if deleted
  if (status !== 'archived' && Statuses.generic.archived.meetsCondition(document)) {
    conflicts.push({
      type: 'warning',
      message: i18n.t('text.document_will_be_unarchived', { documentType }),
      solve() {
        archiveDocument(document, documentType)
      }
    })
  }
  // restore if deleted
  if (status !== 'deleted' && Statuses.generic.deleted.meetsCondition(document)) {
    conflicts.push({
      type: 'warning',
      message: i18n.t('text.document_will_be_restored', { documentType }),
      solve() {
        restoreDocument(document, documentType)
      }
    })
  }

  return conflicts
}

export default checkForGenericConflicts
