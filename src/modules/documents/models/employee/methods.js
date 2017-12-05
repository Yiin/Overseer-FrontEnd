import Api from '@/api'
import store from '@/store'
import { getRepositoryName } from '@/modules/documents/helpers'

const EmployeeMethods = (superclass) => class extends superclass {

  /**
   * Set employee user if one is not set.
   */
  setUser(user) {
    if (this.user) {
      return
    }
    this.user = user
    this.account = !!user
  }

  /**
   * Check if this employee is assigned to given
   * company.
   */
  isInCompany(uuid) {
    if (typeof uuid === 'object') {
      uuid = uuid.uuid
    }

    return this.companies.findIndex((company) => {
      return company.uuid === uuid
    }) > -1
  }

  /**
   * Check if this employee is current authenticated user
   */
  isMe() {
    return this.user && this.user.uuid === store.state.auth.user.uuid
  }

  /**
   * Get profile picture
   *
   * Use placeholder if employee doesnt have any picture set.
   */
  getPicture() {
    return this.profilePicture || require('@/assets/images/placeholders/profile-placeholder.svg')
  }

  /**
   * Get first visible role that this employee has
   */
  getRoleName() {
    const role = this.roles.find((role) => role.name)

    if (!role) {
      return '-'
    }
    return role.name
  }

  can(action, document, scope) {
    return this.roles.findIndex((x) => {
      return x.can(action, document, scope)
    }) > -1
  }

  getAllPermissions() {
    return this.roles.reduce((permissions, role) => {
      return permissions.concat(role.permissions)
    }, [])
  }

  updateDocuments(previous) {
    this.removeUnaccessibleDocuments()
    this.fetchNowAccessibleDocuments(previous)
  }

  removeUnaccessibleDocuments() {
    [
      'client',
      'credit',
      'employee',
      'expense',
      'invoice',
      'payment',
      'product',
      'project',
      'taskList',
      'task',
      'quote',
      'vendor'
    ].forEach((documentType) => {
      const items = store.state.documents.repositories[documentType].items
      const itemsToRemove = items.filter((item) => !this.can('view', item))

      if (itemsToRemove.length) {
        store.commit(`documents/repositories/${documentType}/REMOVE_ITEMS`, itemsToRemove)
      }
    })
  }

  fetchNowAccessibleDocuments(previous) {
    const permissions = this.getAllPermissions().filter((permission) => {
      const found = previous.getAllPermissions().find((previousPermission) => {
        return permission.isSame(previousPermission)
      })

      return !found
    }).map((permission) => {
      return {
        action: permission.action,
        permissible_type: permission.permissibleType,
        scope: permission.scope,
        scope_id: permission.scopeId
      }
    })

    /**
     * Fetch documents that we can access with
     * our new permissions if we have any.
     */
    if (permissions.length) {
      Api.post('documents/accessible', {
        permissions
      }).then((data) => {
        for (let documentType in data) {
          const repositoryName = getRepositoryName(documentType)

          store.dispatch(`documents/repositories/${repositoryName}/ADD_ITEMS`, data[documentType])
        }
      })
    }
  }
}

export default EmployeeMethods
