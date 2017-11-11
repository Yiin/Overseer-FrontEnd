// import Vue from 'vue'
import moment from 'moment'
import Model from './model'

export default class Document extends Model {
  getTitle() {
    return this.name || 'Undefined'
  }

  update(data) {
    this.fill(
      this.constructor.parse(data)
    )
    return this
  }

  static parse(data) {
    const parsedData = {}

    parsedData.uuid = data.uuid
    parsedData.createdAt = data.created_at && moment(data.created_at.date)
    parsedData.updatedAt = data.updated_at && moment(data.updated_at.date)
    parsedData.archivedAt = data.archived_at && moment(data.archived_at.date)
    parsedData.deletedAt = data.deleted_at && moment(data.deleted_at.date)
    parsedData.isDisabled = Boolean(data.is_disabled)

    const Activity = require('./activity').default
    parsedData.history = (data.history || []).map(Activity.create, Activity)

    return parsedData
  }
}
