import store from '@/store'
import { getFormName, getResourceName, getRepositoryName } from './helpers'

export const archiveDocument = (document, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_ARCHIVE`, document)
}

export const deleteDocument = (document, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_DELETE`, document)
}

export const deleteDocuments = (uuids, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_DELETE_MANY`, uuids)
}

export const restoreDocument = (document, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_RESTORE`, document)
}

export const patchDocument = (document, documentType, changes) => {
  if (typeof document === 'undefined' || !document) {
    return
  }
  const repositoryName = getRepositoryName(documentType)
  const resourceName = getResourceName(documentType)

  return store.dispatch(`documents/repositories/${repositoryName}/API_PATCH`, {
    uuid: document.uuid,
    data: {
      [resourceName]: Object.assign({}, changes)
    }
  })
}

export const createDocument = (documentType, prefilledData = {}, tabIndex = null) => {
  const formName = getFormName(documentType)

  const promise = store.dispatch(`form/${formName}/OPEN_CREATE_FORM`)

  store.dispatch(`form/${formName}/SET_FORM_DATA`, prefilledData)
  if (tabIndex !== null) {
    store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', tabIndex)
  }
  return promise
}

export const editDocument = (document, documentType, tabIndex = null) => {
  if (typeof document === 'undefined' || !document) {
    return
  }
  const formName = getFormName(documentType)
  store.dispatch(`form/${formName}/OPEN_EDIT_FORM`, document)
  if (tabIndex !== null) {
    store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', tabIndex)
  }
}
