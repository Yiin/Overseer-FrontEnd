import store from '@/store'
import { getTableName, getFormName, getResourceName } from './helpers'

export const archiveDocument = (document, documentType) => {
  const tableName = getTableName(documentType)
  return store.dispatch(`table/${tableName}/ARCHIVE_DOCUMENT`, document)
}

export const deleteDocument = (document, documentType) => {
  const tableName = getTableName(documentType)
  return store.dispatch(`table/${tableName}/DELETE_DOCUMENT`, document)
}

export const deleteDocuments = (uuids, documentType) => {
  const tableName = getTableName(documentType)
  return store.dispatch(`table/${tableName}/DELETE_DOCUMENTS`, uuids)
}

export const restoreDocument = (document, documentType) => {
  const tableName = getTableName(documentType)
  return store.dispatch(`table/${tableName}/RESTORE_DOCUMENT`, document)
}

export const patchDocument = (document, documentType, changes) => {
  const tableName = getTableName(documentType)
  const resourceName = getResourceName(documentType)

  return store.dispatch(`table/${tableName}/PATCH_DOCUMENT`, {
    uuid: document.uuid,
    data: {
      [resourceName]: Object.assign({}, changes)
    }
  })
}

export const createDocument = (documentType, prefilledData = {}, tabIndex = null) => {
  const formName = getFormName(documentType)
  store.dispatch(`form/${formName}/OPEN_CREATE_FORM`)
  store.dispatch(`form/${formName}/SET_FORM_DATA`, prefilledData)
  if (tabIndex !== null) {
    store.dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', tabIndex)
  }
}

export const editDocument = (document, documentType, tabIndex = null) => {
  const formName = getFormName(documentType)
  console.log(formName, document)
  store.dispatch(`form/${formName}/OPEN_EDIT_FORM`, document)
  if (tabIndex !== null) {
    store.dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', tabIndex)
  }
}
