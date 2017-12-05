import store from '@/store'
import Model from './model'
import { getResourceName } from '../helpers'

/**
 * Permission
 *
 * Scope describes on what level this permission has effect.
 * Permission has access to documents of specified type under its scope
 *   - account: gives user access to resource of this account
 *   - company: gives user access to resource of company
 *   - document: gives user access to specific document
 *
 * scope: account | company | document
 * scopeId: uuid of account | company
 * permissibleType: Product | User | Invoice | Expense | Employeer | ... AbstractDocument
 * permissionType: view | create | edit | delete
 */

/**
 * Examples
 *
 * Can edit all company employees
  const companyLevelPermission = {
    scope: 'company',
    scopeId: '<company-uuid>',
    permissibleType: 'employee',
    action: 'edit'
  }
 *
 * Can edit specific employee
  const documentLevelPermission = {
    scope: 'document',
    scopeId: '<employee-uuid>',
    permissibleType: 'employee',
    action: 'edit'
  }
 *
 */

class Permission extends Model {
  static create(data) {
    return new this({
      scope: data.scope,
      scopeId: data.scope_id,
      permissibleType: data.permissible_type,
      action: data.action
    })
  }

  isSame(otherPermission) {
    if (this.scope !== otherPermission.scope) {
      return false
    }
    if (this.scopeId !== otherPermission.scopeId) {
      return false
    }
    if (this.permissibleType !== otherPermission.permissibleType) {
      return false
    }
    if (this.action !== otherPermission.action) {
      return false
    }
    return true
  }

  getScopeable() {
    switch (this.scope) {
    case 'company': return store.getters['documents/repositories/company/FIND_ITEM_BY_KEY'](this.scopeId)
    case 'client': return store.getters['documents/repositories/client/FIND_ITEM_BY_KEY'](this.scopeId)
    }
    return null
  }

  can(...args) {
    const ret = this._can(...args)

    if (ret) {
      console.log('permission.can', ...args, this)
    }

    return ret
  }

  _can(action, document, scope = null) {
    if (this.action !== '*') {
      if (action !== this.action) {
        return false
      }
    }

    const documentType = getResourceName(typeof document === 'string' ? document : document.constructor.name)

    if (this.permissibleType !== '*') {
      if (documentType !== this.permissibleType) {
        return false
      }
    }

    const Account = require('./account').default
    const Company = require('./company').default
    const Client = require('./client').default

    // actions that doesn't require document instance,
    // only it's type, e.g. 'create'
    if (typeof document === 'string') {
      // scope should be specified
      if (!scope) {
        return false
      }

      if (scope instanceof Account) {
        return this.scope === 'account'
      }
      if (scope instanceof Company) {
        switch (this.scope) {

        /**
         * Account level permission gives access to any company
         */
        case 'account': return true

        case 'company': return this.scopeId === scope.uuid

        /**
         * Allow client level permission to take effect on company level scope
         * for specific docuemnt types.
         *
         * We do this, because api should not return any documents we have
         * no access to anyways, plus we need to be able to create new documents
         * for client on company behalf.
         */
        case 'client': return [
          'invoice',
          'payment',
          'credit',
          'quote',
          'expense',
          'project',
          'task-list',
          'task'
        ].indexOf(documentType) > -1 && this.getScopeable() && this.getScopeable().company.uuid === scope.uuid

        default: return false
        }
      }
      if (scope instanceof Client) {
        switch (this.scope) {
        case 'account': return true
        case 'company': return this.scopeId === scope.company.uuid
        case 'client': return this.scopeId === scope.uuid
        default: return false
        }
      }
      throw new Error('Invalid scope: ' + JSON.stringify(scope))
    } else {
      /**
       * We're given a document, so simply check if we have access
       * to this document.
       */
      switch (this.scope) {

      /**
       * Account level permissions give access to all account documents.
       *
       * Because user belongs only to single account, it's safe to assume
       * that this document also belongs to the same account. If not,
       * this code is probably least important thing that we need to fix.
       */
      case 'account':
        return true

      /**
       * Check if document's company is the same we have access to.
       */
      case 'company':
        return document.company && document.company.uuid === this.scopeId

      /**
       * If this permission only gives permission to documents of
       * specific client, check if given document is assigned to
       * our client.
       */
      case 'client':

        /**
         * If document is a client itself, compare uuids
         */
        if (document instanceof Client) {
          return document.uuid === this.scopeId
        }

        return document.client && document.client.uuid === this.scopeId

      /**
       * If this permission only gives permission to specific document,
       * check if given document is the one.
       */
      case 'document':
        return document.uuid === this.scopeId
      }
      return false
    }
  }
}

export default Permission
