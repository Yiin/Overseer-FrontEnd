import moment from 'moment'
import { mix } from 'mixwith'
// import store from '@/store'
import Model from './model'
import SerializesData from './concerns/serializes-data'
import HasRoles from './concerns/has-roles'

class Company extends mix(Model).with(SerializesData, HasRoles) {
  static create(data) {
    return new this(this.parse(data))
  }

  static parse(data) {
    return {
      ...super.parse(data),

      uuid: data.uuid,

      name: data.name,
      email: data.email,
      logoUrl: data.logo_url,

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

    // if (this === ) {
    //   store.commit('auth/UPDATE_USER')
    // }
    return this
  }
}

export default Company
