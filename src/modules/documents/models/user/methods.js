import _ from 'lodash'
import Api from '@/api'
import store from '@/store'
import { getRepositoryName } from '@/modules/documents/helpers'
import Client from '../client'
import Vendor from '../vendor'
import Company from '../company'

const UserMethods = (superclass) => class extends superclass {

  isMe() {
    return store.state.auth.user && store.state.auth.user.uuid === this.uuid
  }

  /**
   * Check if this user is assigned to given
   * company.
   */
  isInCompany(uuid) {
    if (typeof uuid === 'object') {
      uuid = uuid.uuid
    }

    return (!this.companies.length && this.company.uuid === uuid) || this.companies.findIndex((company) => {
      return company.uuid === uuid
    }) > -1
  }

  can(action, document, scope) {
    if (typeof scope === 'undefined' || scope instanceof Company) {
      if (!this.isAssignedToManage(document)) {
        return false
      }
    }
    return this.roles.findIndex((x) => {
      return x.can(action, document, scope)
    }) > -1
  }

  /**
   * Checks if we're assigned to manage this document
   */
  isAssignedToManage(document) {
    if (typeof document === 'string') {
      if ([
        'product',
        'role',
        'employee'
      ].indexOf(document) > -1) {
        // Doesn't belong to client
        return true
      }

      /**
       * We have countries assigned to us.
       */
      if (this.assignedCountries.length || this.assignAllCountries) {
        return true
      }

      /**
       * We have clients assigned to us.
       */
      if (this.assignedClients.length || this.assignAllClients) {
        return true
      }

      /**
       * We don't have anything assigned, that means we can't do shit.
       */
      return false
    } else {
      if (document instanceof Vendor) {
        if (!(document instanceof Vendor) && typeof document.vendor === 'undefined') {
          // Doesn't belong to vendor
          return true
        }

        if (this.assignAllCountries) {
          // Can manage vendors from any country
          return true
        }

        const countryId = document instanceof Vendor
          ? document.country
            ? document.country.id
            : null
          : document.vendor.country
            ? document.vendor.country.id
            : null

        if (!countryId) {
          // Vendor has no country set, it can be accessed by anyone
          return true
        }

        if (this.assignedCountries.indexOf(countryId) < 0) {
          // Cant manage country of this vendor
          return false
        }

        // All good
        return true
      } else {
        if (!(document instanceof Client) && typeof document.client === 'undefined') {
          // Doesn't belong to client
          return true
        }

        const clientUuid = document instanceof Client ? document.uuid : document.client.uuid

        if (this.assignAllClients) {
          // Can manage all clients
          return true
        } else if (this.assignedClients.indexOf(clientUuid) < 0) {
          // Can't manage client of this document, forfeit
          return false
        }

        // Countries doesn't matter for direct document management
        return true
      }
    }
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

  /**
   * Fetch documents with new permissions
   */
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
    if (permissions.length ||
        this.assignAllCountries !== previous.assignAllCountries ||
        this.assignAllClients !== previous.assignAllClients ||
        !_.isEqual(this.assignedCountries.slice().sort(), previous.assignedCountries.slice().sort()) ||
        !_.isEqual(this.assignedClients.slice().sort(), previous.assignedClients.slice().sort())
    ) {
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

export default UserMethods
