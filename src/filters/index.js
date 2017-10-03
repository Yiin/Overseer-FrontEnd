import Vue from 'vue'
import numeral from 'numeral'
import moment from 'moment'
import i18n from '@/i18n'
import store from '@/store'

export const currencySymbol = (val) => {
  return (val !== null && typeof val === 'object' ? val.symbol : val) || store.state.settings.currency.symbol
}

export const currency = (val) => {
  return numeral(parseFloat(typeof val === 'object' ? val.value : val)).format('0,0.00')
}

export const t = (val) => {
  return Vue.t(val)
}

export const date = (val) => {
  if (!val) {
    return ''
  }
  if (typeof val === 'string') {
    return moment(val).format('MMM D, Y')
  }
  return moment(val.date).format('MMM D, Y')
}

export const documentStatus = (document) => {
  if (document.archived_at) {
    return 'archived'
  }
  if (document.deleted_at) {
    return 'deleted'
  }
  return undefined
}

export const invoiceStatus = (document) => {
  let commonStatus = documentStatus(document)

  if (commonStatus) {
    return commonStatus
  }

  if (document.due_date && moment().isAfter(document.due_date)) {
    return 'overdue'
  }

  return document.status
}

export const recurringInvoiceStatus = (document) => {
  let commonStatus = documentStatus(document)

  if (commonStatus) {
    return commonStatus
  }

  return document.status
}

export const paymentStatus = (document) => {
  let commonStatus = documentStatus(document)

  if (commonStatus) {
    return commonStatus
  }

  if (document.refunded) {
    return 'refunded'
  } else {
    return 'completed'
  }
}

export const expenseStatus = (document) => {
  let commonStatus = documentStatus(document)

  if (commonStatus) {
    return commonStatus
  }

  if (document.invoice === null && !document.should_be_invoiced) {
    return 'logged'
  }
  if (document.invoice === null && document.should_be_invoiced) {
    return 'pending'
  }
  if (document.invoice && document.invoice.paid_in < document.invoice.amount) {
    return 'invoiced'
  }
  if (document.invoice && document.invoice.paid_in >= document.invoice.amount) {
    return 'paid'
  }
}

export const quoteStatus = (document) => {
  let commonStatus = documentStatus(document)

  if (commonStatus) {
    return commonStatus
  }

  return document.status
}

export const frequencyName = (val) => {
  const frequency = store.state.passive.frequencies.find((f) => val === f.value + ':' + f.type)

  if (frequency) {
    return i18n.t(`frequency.${frequency.name}`)
  }
  return i18n.t('frequency.use_client_terms')
}

export const projectProgress = (tasks) => {
  const total = tasks.length
  const completed = tasks.filter((task) => task.is_completed).length

  return `${completed} / ${total}`
}
