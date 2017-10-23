import Vue from 'vue'
import { ObjectModel, FunctionModel } from 'objectmodel'
import moment from 'moment'

const Document = new ObjectModel({
  uuid: [String],
  isDisabled: Boolean,
  createdAt: [moment],
  updatedAt: [moment],
  archivedAt: [moment],
  deletedAt: [moment],

  update: Function
}).defaults({
  isDisabled: false
})

function parse(data) {
  const documentData = {}

  documentData.isDisabled = Boolean(data.is_disabled)
  documentData.uuid = data.uuid
  documentData.createdAt = data.created_at && moment(data.created_at.date)
  documentData.updatedAt = data.updated_at && moment(data.updated_at.date)
  documentData.archivedAt = data.archived_at && moment(data.archived_at.date)
  documentData.deletedAt = data.deleted_at && moment(data.deleted_at.date)

  return documentData
}

Document.create = function (data) {
  if (typeof this === 'undefined') {
    const exception = {
      message: 'Document has no constructor.'
    }
    throw exception
  }
  const parsedData = Object.assign(
    parse(data),
    this.parse(data)
  )
  return new this(parsedData)
}

Document.prototype.update = FunctionModel(Object).return()(function (data) {
  const documentData = Object.assign(parse(data), this.constructor.parse(data))

  for (let key in documentData) {
    Vue.set(this, key, documentData[key])
  }
})

export default Document
