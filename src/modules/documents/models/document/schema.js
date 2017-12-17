import moment from 'moment'

const DocumentSchema = (superclass) => class extends superclass {
  static parse(data) {
    const parsedData = {}

    parsedData.uuid = data.uuid
    parsedData.userUuid = data.user_uuid
    parsedData.createdAt = data.created_at && moment(data.created_at.date)
    parsedData.updatedAt = data.updated_at && moment(data.updated_at.date)
    parsedData.archivedAt = data.archived_at && moment(data.archived_at.date)
    parsedData.deletedAt = data.deleted_at && moment(data.deleted_at.date)
    parsedData.isDisabled = Boolean(data.is_disabled)
    parsedData.isHistory = Boolean(data.is_history)

    if (parsedData.isHistory) {
      parsedData.history = []
    } else {
      const Activity = require('../activity').default
      parsedData.history = (data.history || []).map(Activity.create, Activity)
    }

    return parsedData
  }

  serialize(options = {}) {
    return {
      uuid: options.fresh ? null : this.uuid
    }
  }
}

export default DocumentSchema
