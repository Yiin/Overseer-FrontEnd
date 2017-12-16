import moment from 'moment'
import S from 'string'
import Model from './model'
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
import Employee from './employee'
import Role from './role'

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
      'vendor': Vendor,
      'employee': Employee,
      'role': Role
    }

    if (!('document' in data) || !(data.document.type in map)) {
      return null
    }

    const timestamp = moment(data.timestamp.date)
    const colorIndex = (timestamp.date() % 6) + 1

    return new Activity({
      id: data.id,
      user: {
        ...data.user
      },
      action: data.action,
      document: {
        data: map[data.document.type].create({
          is_history: true,
          ...data.document.data
        }),
        type: data.document.type,
        fromBackup: data.document.from_backup
      },
      backup: data.backup,
      changes: data.changes,
      timestamp,
      colorIndex
    })
  }

  getTitle() {
    const action = S(this.action).capitalize().s
    const date = this.timestamp.format('MMM D, YYYY')

    return `${action} on ${date}`
  }

  hasUser() {
    return this.user && this.user.authenticable_type
  }

  /**
   * Returns authenticable or null, not the real user instance.
   *
   * @return {Employee|Client|null}
   */
  getUser() {
    if (this.hasUser()) {
      const EmployeeRepository = require('../repositories/employee').methods
      const ClientRepository = require('../repositories/client').methods

      const authenticable = {
        'employee': EmployeeRepository,
        'client': ClientRepository
      }[this.user.authenticable_type].findByKey(this.user.authenticable_id)

      return authenticable
    }

    return null
  }
}

export default Activity
