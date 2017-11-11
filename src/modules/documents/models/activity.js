import moment from 'moment'
import Model from './model'
import User from './user'
import Client from './client'
import Credit from './credit'
import Expense from './expense'
import Invoice from './invoice'
import Payment from './payment'
import Product from './product'
import Project from './project'
import Quote from './quote'
import TaskList from './task-list'
import Task from './task'
import Vendor from './vendor'

class Activity extends Model {
  static create(data) {
    const map = {
      'client': Client,
      'credit': Credit,
      'expense': Expense,
      'payment': Payment,
      'product': Product,
      'project': Project,
      'quote': Quote,
      'task-list': TaskList,
      'task': Task,
      'invoice': Invoice,
      'vendor': Vendor
    }

    if (!('document' in data) || !(data.document.type in map)) {
      return null
    }

    const timestamp = moment(data.timestamp.date)
    const colorIndex = (timestamp.date() % 7)

    return new Activity({
      id: data.id,
      user: data.user && User.create(data.user),
      action: data.action,
      document: {
        data: map[data.document.type].create(data.document.data),
        type: data.document.type,
        fromBackup: data.document.from_backup
      },
      backup: data.backup,
      changes: data.changes,
      timestamp,
      colorIndex
    })
  }
}

export default Activity
