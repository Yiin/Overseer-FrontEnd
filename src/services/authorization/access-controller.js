import store from '@/store'
import { getRepositoryName, getResourceName } from '@/modules/documents/helpers'

function user() {
  return store.state.auth.user || {
    can() {
      return false
    }
  }
}

class AccessController {
  can({ action, params }) {
    switch (action) {
    case 'access-page':
      return this.canAccessPage(params.name)

    case 'create-document':
      return this.canCreateDocument(params.name)

    case 'view-document':
      return this.canViewDocument(params.name, params.uuid)

    case 'edit-document':
      return this.canEditDocument(params.name, params.uuid)
    }
    return false
  }

  canAccessPage(name) {
    const resourceName = getResourceName(name)
    const repositoryName = getRepositoryName(name)

    if (user().can('view', resourceName, user().company)) {
      return true
    }
    // if given documents repository contains any items, show page anyways.
    return store.getters[`documents/repositories/${repositoryName}/AVAILABLE_COMPANY_ITEMS`].length
  }

  canCreateDocument(name) {
    const resourceName = getResourceName(name)

    return user().can('create', resourceName, user().company)
  }

  canViewDocument(name, uuid) {
    if (typeof name === 'object') {
      return user().can('view', name)
    }

    const repositoryName = getRepositoryName(name)

    const document = store.getters[`documents/repositories/${repositoryName}/FIND_ITEM_BY_KEY`](uuid)

    if (!document) {
      return false
    }

    return user().can('view', document)
  }

  canEditDocument(name, uuid) {
    if (typeof name === 'object') {
      return user().can('edit', name)
    }

    const repositoryName = getRepositoryName(name)

    const document = store.getters[`documents/repositories/${repositoryName}/FIND_ITEM_BY_KEY`](uuid)

    if (!document) {
      return false
    }

    return user().can('edit', document)
  }
}

export default AccessController
