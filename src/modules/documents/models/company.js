import moment from 'moment'
import { mix } from 'mixwith'
import Model from './model'
import Role from './role'
import SerializesData from './concerns/serializes-data'

class Company extends mix(Model).with(SerializesData) {
  static create(data) {
    return new this(this.parse(data))
  }

  static parse(data) {
    return {
      uuid: data.uuid,

      name: data.name,
      email: data.email,
      logoUrl: data.logo_url,

      roles: (data.roles || []).map(Role.create, Role),

      createdAt: data.created_at && moment(data.created_at),
      updatedAt: data.updated_at && moment(data.updated_at),
      deletedAt: data.deleted_at && moment(data.created_at)
    }
  }

  serialize(options = {}) {
    return {
      uuid: options.fresh ? null : this.uuid,
      name: this.name,
      email: this.email,
      logo_url: this.logoUrl
    }
  }

  update(data) {
    this.fill(
      this.constructor.parse(data)
    )
    return this
  }
}

export default Company
