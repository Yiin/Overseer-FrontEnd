import moment from 'moment'
import Model from './model'
import Permission from './permission'

class Role extends Model {
  static create(data) {
    return new this(this.parse(data))
  }

  static parse(data) {
    return {
      uuid: data.uuid,

      name: data.name,
      permissions: (data.permissions || []).map(Permission.create, Permission),
      roleable: data.roleable_type && {
        'user': require('../repositories/user').methods,
        'company': require('../repositories/company').methods
      }[data.roleable_type].findByKey(data.roleable_id),

      createdAt: data.created_at && moment(data.created_at),
      updatedAt: data.updated_at && moment(data.updated_at)
    }
  }

  init() {
    this.updateRoleable()
  }

  update(data) {
    this.fill(
      this.constructor.parse(data)
    )

    this.updateRoleable()

    return this
  }

  updateRoleable() {
    /**
     * If this role has roleable,
     * try to add it to the list of roles roleable
     * has.
     */
    if (this.roleable && typeof this.roleable.addRoleOrDoNothing === 'function') {
      this.roleable.addRoleOrDoNothing(this)
    }
  }

  getTitle() {
    return this.name || '<Private Role>'
  }

  can(action, document, scope) {
    return this.permissions.findIndex((permission) => {
      return permission.can(action, document, scope)
    }) > -1
  }

  setPermission(action, type, scope, scopeId, state) {
    const permission = this.permissions.find((permission) => {
      return permission.scope === scope &&
        permission.scopeId === scopeId &&
        permission.permissibleType === type &&
        permission.action === action
    })

    if (state && !permission) {
      this.permissions.push(Permission.create({
        scope,
        scope_id: scopeId,
        permissible_type: type,
        action
      }))
    } else if (!state && permission) {
      this.permissions = this.permissions.filter((p) => p !== permission)
    }
  }

  serialize() {
    return {
      name: this.name,
      permissions: this.permissions.map((permission) => permission.serialize())
    }
  }
}

export default Role
