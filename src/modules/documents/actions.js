import S from 'string'
import store from '@/store'
import { getFormName, getRepositoryName, getResourceName, getDocumentTitle } from './helpers'
import AuthorizationService from '@/services/authorization'

function getRouter() {
  if (typeof getRouter.router === 'undefined') {
    getRouter.router = require('@/router').default
  }
  return getRouter.router
}

function showUndoNotification(message, action) {
  return (responseData) => {
    if (Array.isArray(responseData)) {
      store.dispatch('notification/SHOW', {
        message,
        action: action.bind(null, responseData),
        actionText: 'UNDO'
      })
    } else {
      store.dispatch('notification/SHOW', {
        message,
        action: action.bind(null, responseData),
        actionText: 'UNDO'
      })
    }
  }
}

/**
 * Archive document
 */
export const archiveDocument = (document, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_ARCHIVE`, document)
    .then(
      showUndoNotification(
        `Archived one ${getDocumentTitle(documentType)}.`,
        () => {
          store.dispatch(`documents/repositories/${repositoryName}/API_UNARCHIVE`, document)
        }))
}

/**
 * Archive multiple documents
 */
export const archiveDocuments = (uuids, documentType) => {
  const repositoryName = getRepositoryName(documentType)

  return store.dispatch(`documents/repositories/${repositoryName}/API_ARCHIVE_MANY`, uuids)
    .then(
      showUndoNotification(
        `Archived ${uuids.length} ${getDocumentTitle(documentType, 'plural')}.`,
        () => {
          store.dispatch(`documents/repositories/${repositoryName}/API_UNARCHIVE_MANY`, uuids)
        }))
}

/**
 * Unarchive document
 */
export const unarchiveDocument = (document, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_UNARCHIVE`, document)
    .then(
      showUndoNotification(
        `Unarchived one ${getDocumentTitle(documentType)}`,
        () => {
          store.dispatch(`documents/repositories/${repositoryName}/API_ARCHIVE`, document)
        }))
}

/**
 * Unarchive many documents
 */
export const unarchiveDocuments = (uuids, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_UNARCHIVE_MANY`, uuids)
    .then(
      showUndoNotification(
        `Unarchived ${uuids.length} ${getDocumentTitle(documentType, 'plural')}`,
        () => {
          store.dispatch(`documents/repositories/${repositoryName}/API_ARCHIVE_MANY`, uuids)
        }))
}

/**
 * Delete document
 */
export const deleteDocument = (document, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_DELETE`, document)
    .then(
      showUndoNotification(
        `Deleted one ${getDocumentTitle(documentType)}.`,
        () => {
          store.dispatch(`documents/repositories/${repositoryName}/API_RESTORE`, document)
        }))
}

/**
 * Delete multiple documents
 */
export const deleteDocuments = (uuids, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_DELETE_MANY`, uuids)
    .then(
      showUndoNotification(
        `Deleted ${uuids.length} ${getDocumentTitle(documentType, 'plural')}.`,
        () => {
          store.dispatch(`documents/repositories/${repositoryName}/API_RESTORE_MANY`, uuids)
        }))
}

/**
 * Recover document
 */
export const recoverDocument = (document, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_RESTORE`, document)
    .then(
      showUndoNotification(
        `Recovered one ${getDocumentTitle(documentType)}`,
        () => {
          store.dispatch(`documents/repositories/${repositoryName}/API_DELETE`, document)
        }))
}

/**
 * Recover many documents
 */
export const recoverDocuments = (uuids, documentType) => {
  const repositoryName = getRepositoryName(documentType)
  return store.dispatch(`documents/repositories/${repositoryName}/API_RESTORE_MANY`, uuids)
    .then(
      showUndoNotification(
        `Recovered ${uuids.length} ${getDocumentTitle(documentType, 'plural')}`,
        () => {
          store.dispatch(`documents/repositories/${repositoryName}/API_DELETE_MANY`, uuids)
        }))
}

/**
 * Patch document
 */
export const patchDocument = (document, documentType, changes) => {
  if (typeof document === 'undefined' || !document) {
    return
  }
  const repositoryName = getRepositoryName(documentType)

  return store.dispatch(`documents/repositories/${repositoryName}/API_PATCH`, {
    uuid: document.uuid,

    ...changes
  })
}

/**
 * Create document
 */
export const createDocument = (documentType, prefilledData = {}, { tabIndex = null } = {}) => {
  const resourceName = getResourceName(documentType)

  if (!AuthorizationService.accessController.canCreateDocument(resourceName)) {
    return Promise.reject()
  }

  const formName = getFormName(documentType)

  const promise = store.dispatch(`form/${formName}/OPEN_CREATE_FORM`)

  store.dispatch(`form/${formName}/SET_FORM_DATA`, prefilledData)
  if (tabIndex !== null) {
    store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', tabIndex)
  }

  return promise
}

/**
 * Preview document
 */
export const viewDocument = (document, documentType, { tabIndex = null, title = null } = {}) => {
  if (typeof document === 'string') {
    const repositoryName = getRepositoryName(documentType)
    document = store.getters[`documents/repositories/${repositoryName}/FIND_ITEM_BY_KEY`](document)
  }
  if (typeof document === 'undefined' || !document) {
    return Promise.reject()
  }
  const resourceName = getResourceName(documentType)
  const formName = getFormName(documentType)
  const router = getRouter()

  if (router.currentRoute.name && router.currentRoute.name !== resourceName + '.view') {
    router.push({
      name: resourceName + '.view',
      params: {
        uuid: document.uuid
      }
    })
  }

  const promise = store.dispatch(`form/${formName}/OPEN_PREVIEW_FORM`, {
    title,
    data: document
  })

  if (tabIndex !== null) {
    store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', tabIndex)
  }

  return promise
}

/**
 * Edit document
 */
export const editDocument = (document, documentType, { tabIndex = null, title = null } = {}) => {
  if (typeof document === 'string') {
    const repositoryName = getRepositoryName(documentType)
    document = store.getters[`documents/repositories/${repositoryName}/FIND_ITEM_BY_KEY`](document)
  }
  if (typeof document === 'undefined' || !document) {
    return Promise.reject()
  }
  const resourceName = getResourceName(documentType)
  const formName = getFormName(documentType)
  const router = getRouter()

  /**
   * If user has no permission to edit document, try to show him preview form.
   */
  if (!AuthorizationService.accessController.canEditDocument(resourceName, document.uuid)) {
    return viewDocument(document, documentType, { tabIndex, title })
  }

  if (router.currentRoute.name && router.currentRoute.name !== resourceName + '.edit') {
    router.push({
      name: resourceName + '.edit',
      params: {
        uuid: document.uuid
      }
    })
  }

  const promise = store.dispatch(`form/${formName}/OPEN_EDIT_FORM`, {
    title,
    data: document
  })

  if (tabIndex !== null) {
    store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', tabIndex)
  }

  return promise
}

/**
 * Review document state
 */
export const reviewDocumentState = (documentState, documentType, { tabIndex = null, activity, title = null }) => {
  if (typeof documentState === 'undefined' || !documentState) {
    return Promise.reject()
  }

  /**
   * Get document model, if only key was passed
   */
  if (typeof documentState === 'string') {
    const repositoryName = getRepositoryName(documentType)
    documentState = store.getters[`documents/repositories/${repositoryName}/FIND_ITEM_BY_KEY`](documentState)

    if (!documentState) {
      return Promise.reject()
    }
  }

  /**
   * Get activity model if only it's id was passed
   */
  if (typeof activity === 'string') {
    activity = documentState.history.find((a) => Number(a.id) === Number(activity))

    if (!activity) {
      return Promise.reject()
    }
  }

  const resourceName = getResourceName(documentType)
  const formName = getFormName(documentType)
  const router = getRouter()

  /**
   * Update URL
   */
  if (router.currentRoute.name && router.currentRoute.name !== resourceName + '.revision') {
    router.push({
      name: resourceName + '.revision',
      params: {
        uuid: documentState.uuid,
        activity: activity.id
      }
    })
  }

  /**
   * Generate new title if one wasn't provided
   */
  if (!title) {
    const action = S(activity.action).capitalize().s
    const date = activity.timestamp.format('MMM D, YYYY')
    title = `${action} on ${date}`
  }

  /**
   * Open form
   */
  const model = activity.document.data.constructor
  documentState = model.create(JSON.parse(activity.backup.documentTransformed)).serialize()

  const promise = store.dispatch(`form/${formName}/OPEN_HISTORY_REVIEW_FORM`, {
    title,
    data: documentState,
    activity
  })

  if (tabIndex !== null) {
    store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', tabIndex)
  }

  return promise
}
