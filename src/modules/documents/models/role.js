import moment from 'moment'
import Model from './model'
import Permission from './permission'

class Role extends Model {
  static create(data) {
    return new this({
      uuid: data.uuid,

      name: data.name,
      permissions: data.permissions.map(Permission.create, Permission),

      createdAt: data.created_at && moment(data.created_at),
      updatedAt: data.updated_at && moment(data.updated_at)
    })
  }

  getTitle() {
    return this.name || '<Private Role>'
  }

  can(action, document, scope) {
    return this.permissions.findIndex((permission) => {
      return permission.can(action, document, scope)
    }) > -1
  }
}

export default Role
