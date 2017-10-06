import i18n from '@/i18n'

import {
  deleteDocuments,
  editDocument,
  patchDocument
} from '@/modules/documents/actions'

import Statuses from './index'

/**
 * Warn if invoice has payments, who shouldn't exist
 */
export const checkForExistingPaymentsConflict = (invoice) => {
  const conflicts = []

  // invoice has some payments who needs to be deleted first
  if (invoice.payments && invoice.payments.length) {
    conflicts.push({
      type: 'warning',
      message: i18n.t('invoice_payments_will_be_deleted'),
      solve() {
        const payments = invoice.payments.map((payment) => payment.uuid)
        deleteDocuments(payments, 'payments')
      }
    })
  } else {
    if (invoice.partial) {
      conflicts.push({
        type: 'warning',
        message: i18n.t('invoice_partial_will_be_removed'),
        solve() {
          patchDocument(invoice, 'invoice', { partial: 0 })
        }
      })
    }
  }

  return conflicts
}

/**
 * Warn if invoice was already sent
 */
export const checkForInvoiceMailingConflicts = (invoice) => {
  const conflicts = []

  if (Statuses.invoice.sent.meetsCondition(invoice)) {
    conflicts.push({
      type: 'warning',
      message: i18n.t('text.invoice_will_be_queued_to_be_sent_again'),
      tip: i18n.t('text.clone_invoice_and_mark_it_to_be_sent')
    })
  }
  return conflicts
}

/**
 * If invoice is overdue, in order to change status
 * to another, we need to postpone invoice's due date
 */
export const checkForOverdueConflict = (invoice, status) => {
  const conflicts = []

  if (status !== 'overdue' && Statuses.invoice.overdue.meetsCondition(invoice)) {
    conflicts.push({
      type: 'error',
      message: i18n.t('text.invoice_due_date_needs_to_be_delayed'),
      solve() {
        editDocument(invoice, 'invoice', 1)
      }
    })
  }
  return conflicts
}

/**
 * If invoice is currently draft, we need
 * to change it's state to any other
 */
export const checkForDraftInvoiceConflict = (invoice, status) => {
  const conflicts = []

  if (Statuses.invoice.draft.meetsCondition(invoice)) {
    conflicts.push({
      type: 'warning',
      message: i18n.t('text.invoice_status_will_be_changed_to_sent'),
      solve() {
        return Statuses.invoice.sent.apply(invoice, status)
      }
    })
  }

  return conflicts
}

/**
 * If invoice is fully paid by payments,
 * suggest available options how to change that
 */
export const checkForPaidInvoiceConflicts = (invoice, status) => {
  const conflicts = []

  // options what to change, to make invoice not fully paid
  const availableOptions = []

  if (Statuses.invoice.paid.meetsCondition(invoice)) {
    // if invoice is fully paid by payments, and not just marked as paid
    if (invoice.payments && invoice.payments.length && invoice.paid_in >= invoice.amount) {
      availableOptions.push({
        message: i18n.t('text.increase_items_price')
      })
      if (invoice.paid_in - invoice.partial < invoice.amount) {
        availableOptions.push({
          message: i18n.t('text.reduce_deposit_amount_at_least_by_x', { x: invoice.paid_in - invoice.amount })
        })
      }
      availableOptions.push({
        message: i18n.t('text.delete_some_of_the_invoice_payments')
      })
    } else {
      switch (status) {
      case 'partial':
        break
      case 'overdue':
        conflicts.push({
          type: 'warning',
          message: i18n.t('text.invoice_status_will_be_changed_to_sent'),
          solve() {
            return Statuses.invoice.sent.apply(invoice, status)
          }
        })
        break
      default:
        if (!Statuses.invoice.partial.meetsCondition(invoice)) {
          conflicts.push({
            type: 'warning',
            message: i18n.t('text.invoice_status_will_be_changed_to_partially_paid'),
            solve() {
              return Statuses.invoice.partial.apply(invoice, status)
            }
          })
        }
      }
    }
  }

  if (availableOptions.length) {
    conflicts.push({
      type: 'error',
      availableOptions,
      solve() {
        editDocument(invoice, 'invoice')
      }
    })
  }

  return conflicts
}
