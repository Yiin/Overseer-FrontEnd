import moment from 'moment'
import i18n from '@/i18n'

import checkForGenericConflicts from './generic-conflicts'
import {
  checkForExistingPaymentsConflict,
  checkForInvoiceMailingConflicts,
  checkForOverdueConflict,
  checkForDraftInvoiceConflict,
  checkForPaidInvoiceConflicts
} from './invoice-conflicts'

import {
  checkForRefundedPaymentConflict,
  checkForCompletedPaymentConflict
} from './payment-conflicts'

import {
  archiveDocument,
  deleteDocument,
  patchDocument,
  editDocument,
  createDocument
} from '@/modules/documents/actions'

const Statuses = {
  /**
   * Generic statuses
   */
  generic: {
    /**
     * Active
     *
     * Document is neither archived nor deleted
     */
    active: {
      isGeneric: true,
      meetsCondition(document) {
        return !Statuses.generic.archived.meetsCondition(document) &&
               !Statuses.generic.deleted.meetsCondition(document)
      }
    },

    /**
     * Archived
     *
     * Document is archived.
     */
    archived: {
      visible: true,
      isGeneric: true,
      name: i18n.t('status.archived'),
      priority: 98,

      meetsCondition(document) {
        return document.archived_at !== null
      },
      apply(document, documentType) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(document, documentType, 'archived'))

        return {
          conflicts,
          solve() {
            archiveDocument(document, documentType)
          }
        }
      }
    },

    /**
     * Deleted
     *
     * Document is deleted together with it's related documents.
     * Deleted documents can be restored to be active again.
     */
    deleted: {
      visible: true,
      isGeneric: true,
      name: i18n.t('status.deleted'),
      priority: 99,

      meetsCondition(document) {
        return document.deleted_at !== null
      },
      apply(document, documentType) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(document, documentType, 'deleted'))

        return {
          conflicts,
          solve() {
            deleteDocument(document, documentType)
          }
        }
      }
    }
  },

  /**
   * Invoice statuses
   */
  invoice: {

    /**
     * Draft
     *
     * Invoice is active, but has not been sent yet.
     */
    draft: {
      visible: true,
      name: i18n.t('status.draft'),
      priority: 10,

      meetsCondition(document) {
        return document.status === 'draft'
      },

      /**
       * Marks invoice as draft
       */
      apply(invoice, status) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(invoice, 'invoice'))

        // Draft invoices shouldn't have any payments
        conflicts = conflicts.concat(checkForExistingPaymentsConflict(invoice, status || 'draft'))

        return {
          conflicts,
          solve() {
            invoice.status = 'draft'
            return patchDocument(invoice, 'invoices', { status: 'draft' })
          }
        }
      }
    },

    /**
     * Pending
     *
     * Invoice is queued to be sent.
     */
    pending: {
      visible: true,
      name: i18n.t('status.pending'),
      priority: 1,

      meetsCondition(document) {
        return document.status === 'pending'
      },

      /**
       * Mark invoice as pending
       */
      apply(invoice, status) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(invoice, 'invoice'))
        conflicts = conflicts.concat(checkForInvoiceMailingConflicts(invoice, status || 'pending'))
        conflicts = conflicts.concat(checkForExistingPaymentsConflict(invoice, status || 'pending'))
        conflicts = conflicts.concat(checkForOverdueConflict(invoice, status || 'pending'))

        return {
          conflicts,
          solve() {
            invoice.status = 'pending'
            return patchDocument(invoice, 'invoices', { status: 'pending' })
          }
        }
      }
    },

    /**
     * Sent
     *
     * Invoice is sent
     */
    sent: {
      visible: true,
      name: i18n.t('status.sent'),
      priority: 2,

      meetsCondition(document) {
        return document.status === 'sent'
      },

      /**
       * Mark invoice as sent, but do not actually send one.
       */
      apply(invoice, status) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(invoice, 'invoice'))
        conflicts = conflicts.concat(checkForExistingPaymentsConflict(invoice, status || 'sent'))
        conflicts = conflicts.concat(checkForOverdueConflict(invoice, status || 'sent'))

        return {
          conflicts,
          solve() {
            invoice.status = 'sent'
            return patchDocument(invoice, 'invoices', { status: 'sent' })
          }
        }
      }
    },

    /**
     * Viewed
     *
     * Invoice was opened
     */
    viewed: {
      visible: true,
      name: i18n.t('status.viewed'),
      priority: 3,

      meetsCondition(document) {
        return document.status === 'viewed'
      },

      /**
       * Mark invoice as pending
       */
      apply(invoice, status) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(invoice, 'invoice'))
        conflicts = conflicts.concat(checkForExistingPaymentsConflict(invoice, status || 'viewed'))
        conflicts = conflicts.concat(checkForOverdueConflict(invoice, status || 'viewed'))

        return {
          conflicts,
          solve() {
            invoice.status = 'viewed'
            return patchDocument(invoice, 'invoices', { status: 'viewed' })
          }
        }
      }
    },

    /**
     * Partial
     *
     * Invoice has payments, but is not fully paid yet.
     */
    partial: {
      visible: true,
      name: i18n.t('status.partial'),
      priority: 4,

      meetsCondition(invoice) {
        return (
          invoice.paid_in > 0 &&
          invoice.paid_in < invoice.amount &&
          !Statuses.invoice.draft.meetsCondition(invoice)
        )
      },

      /**
       * Mark invoice as partially paid
       */
      apply(invoice, status) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(invoice, 'invoice'))
        conflicts = conflicts.concat(checkForPaidInvoiceConflicts(invoice, status || 'partial'))
        conflicts = conflicts.concat(checkForOverdueConflict(invoice, status || 'partial'))

        return {
          conflicts,
          solve() {
            if (Statuses.invoice.partial.meetsCondition(invoice)) {
              return
            }
            return {
              solution: {
                message: i18n.t('text.create_a_payment_with_amount_less_than_x', { x: invoice.amount }),
                solve() {
                  createDocument('payment', {
                    client_uuid: invoice.client.uuid,
                    invoice_uuid: invoice.uuid
                  }, 2)
                }
              }
            }
          }
        }
      }
    },

    /**
     * Overdue
     *
     * Current date is past active and not paid invoice's due date
     */
    overdue: {
      visible: true,
      name: i18n.t('status.overdue'),
      priority: 5,

      meetsCondition(document) {
        return document.due_date && moment().isAfter(moment(document.due_date))
      },

      apply(invoice, status) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(invoice, 'invoice'))
        conflicts = conflicts.concat(checkForDraftInvoiceConflict(invoice, status || 'overdue'))
        conflicts = conflicts.concat(checkForPaidInvoiceConflicts(invoice, status || 'overdue'))

        return {
          conflicts,
          solve() {
            if (Statuses.invoice.overdue.meetsCondition(invoice)) {
              return
            }
            return {
              solution: {
                message: i18n.t('text.set_due_date_to_date_in_the_past'),
                solve() {
                  editDocument(invoice, 'invoice', 1)
                }
              }
            }
          }
        }
      }
    },

    /**
     * Paid
     *
     * Invoice is either fully paid, or marked as paid.
     */
    paid: {
      visible: true,
      name: i18n.t('status.paid'),
      priority: 6,

      meetsCondition(document) {
        return document.paid_in >= document.amount
      },

      apply(invoice) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(invoice, 'invoice'))

        return {
          conflicts,
          solve() {
            if (Statuses.invoice.paid.meetsCondition(invoice)) {
              return
            }
            return {
              solution: {
                message: i18n.t('text.create_a_payment_of_x_or_more', { x: invoice.amount - invoice.paid_in }),
                solve() {
                  createDocument('payment', {
                    client_uuid: invoice.client.uuid,
                    invoice_uuid: invoice.uuid,
                    amount: invoice.amount - invoice.paid_in
                  }, 2)
                }
              }
            }
          }
        }
      }
    },

    /**
     * Unpaid
     *
     * Invoice has not been fully paid yet
     */
    unpaid: {
      meetsCondition(document) {
        return !Statuses.invoice.paid.meetsCondition(document)
      }
    }
  },

  /**
   * Payment statuses
   */
  payment: {
    completed: {
      visible: true,
      name: i18n.t('status.completed'),

      meetsCondition(document) {
        return !Statuses.payment.refunded.meetsCondition(document)
      },

      apply(payment) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(payment, 'payment'))
        conflicts = conflicts.concat(checkForRefundedPaymentConflict(payment))

        return {
          conflicts,
          solve() {
            //
          }
        }
      }
    },

    refunded: {
      visible: true,
      name: i18n.t('status.refunded'),

      meetsCondition(document) {
        return document.refunded > 0
      },

      apply(payment) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(payment, 'payment'))
        conflicts = conflicts.concat(checkForCompletedPaymentConflict(payment))

        return {
          conflicts
        }
      }
    }
  },

  /**
   * Client statuses
   */
  client: {
    vat_verified: {
      meetsCondition(document) {
        return document.vat_status === 'verified'
      }
    },
    vat_pending: {
      meetsCondition(document) {
        return document.vat_status === null
      }
    },
    vat_invalid: {
      meetsCondition(document) {
        return document.vat_status === 'invalid'
      }
    }
  },

  /**
   * Product statuses
   */
  product: {
    in_stock: {
      meetsCondition(document) {
        return document.qty > 0
      }
    },
    out_of_stock: {
      meetsCondition(document) {
        return document.qty < 0 || document.qty === 0
      }
    },
    is_a_service: {
      meetsCondition(document) {
        return document.qty === null
      }
    }
  },

  /**
   * Recurring Invoice statuses
   */
  recurring_invoice: {
    draft: {
      visible: true,
      name: i18n.t('status.draft'),
      priority: 10,

      meetsCondition(document) {
        return document.status === 'draft'
      },

      apply(recurringInvoice) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(recurringInvoice, 'recurring_invoice'))

        return {
          conflicts,
          solve() {
            return patchDocument(recurringInvoice, 'recurring_invoice', { status: 'draft' })
          }
        }
      }
    },

    active: {
      visible: true,
      name: i18n.t('status.active'),
      priority: 1,

      meetsCondition(document) {
        return document.status === 'active'
      },

      apply(recurringInvoice) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(recurringInvoice, 'recurring_invoice'))

        if (recurringInvoice.last_invoice) {
          conflicts = conflicts.concat(checkForOverdueConflict(recurringInvoice.last_invoice, 'invoice'))
        }

        return {
          conflicts,
          solve() {
            return patchDocument(recurringInvoice, 'recurring_invoice', { status: 'active' })
          }
        }
      }
    },
    pending: {
      visible: true,
      name: i18n.t('status.pending'),
      priority: 2,

      meetsCondition(document) {
        return document.last_invoice && Statuses.invoice.pending.meetsCondition(document.last_invoice)
      },

      apply(recurringInvoice) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(recurringInvoice, 'recurring_invoice'))
        // conflicts = conflicts.concat(checkForMissingInvoice)
        conflicts = conflicts.concat(checkForOverdueConflict(recurringInvoice.last_invoice, 'invoice'))

        return {
          conflicts,
          solve() {
            return patchDocument(recurringInvoice, 'recurring_invoice', { status: 'pending' })
          }
        }
      }
    },

    overdue: {
      visible: true,
      name: i18n.t('status.overdue'),
      priority: 3,

      meetsCondition(document) {
        return document.last_invoice && Statuses.invoice.overdue.meetsCondition(document.last_invoice)
      },

      canBeApplied(recurringInvoice) {
        return !!recurringInvoice.last_invoice
      },

      apply(recurringInvoice) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(recurringInvoice, 'recurring_invoice'))

        return {
          conflicts,
          solve() {
            return {
              type: 'error',
              message: i18n.t('text.invoice_due_date_needs_to_be_delayed'),
              solve() {
                editDocument(recurringInvoice.last_invoice, 'recurring_invoice')
              }
            }
          }
        }
      }
    }
  },

  /**
   * Quotes statuses
   */
  quote: {
    draft: {
      visible: true,
      name: i18n.t('status.draft'),
      priority: 10,

      meetsCondition(document) {
        return document.status === 'draft'
      }
    },
    sent: {
      visible: true,
      name: i18n.t('status.sent'),
      priority: 1,

      meetsCondition(document) {
        return document.status === 'sent'
      }
    },
    viewed: {
      visible: true,
      name: i18n.t('status.viewed'),
      priority: 2,

      meetsCondition(document) {
        return document.status === 'viewed'
      }
    },
    approved: {
      visible: true,
      name: i18n.t('status.approved'),
      priority: 3,

      meetsCondition(document) {
        return document.status === 'approved'
      }
    }
  },

  /**
   * Expense statuses
   */
  expense: {
    logged: {
      visible: true,
      name: i18n.t('status.logged'),
      priority: 1,

      meetsCondition(document) {
        return !document.invoice
      }
    },
    invoiced: {
      visible: true,
      name: i18n.t('status.invoiced'),
      priority: 2,

      meetsCondition(document) {
        return document.invoice !== null
      }
    },
    pending: {
      visible: true,
      name: i18n.t('status.pending'),
      priority: 3,

      meetsCondition(document) {
        return document.invoice && Statuses.invoice.pending.meetsCondition(document.invoice)
      }
    },
    sent: {
      visible: true,
      name: i18n.t('status.sent'),
      priority: 4,

      meetsCondition(document) {
        return document.invoice && Statuses.invoice.sent.meetsCondition(document.invoice)
      }
    },
    viewed: {
      visible: true,
      name: i18n.t('status.viewed'),
      priority: 5,

      meetsCondition(document) {
        return document.invoice && Statuses.invoice.viewed.meetsCondition(document.invoice)
      }
    },
    partial: {
      visible: true,
      name: i18n.t('status.partial'),
      priority: 6,

      meetsCondition(document) {
        return document.invoice && Statuses.invoice.partial.meetsCondition(document.invoice)
      }
    },
    paid: {
      visible: true,
      name: i18n.t('status.paid'),
      priority: 7,

      meetsCondition(document) {
        return document.invoice && Statuses.invoice.paid.meetsCondition(document.invoice)
      }
    },
    unpaid: {
      meetsCondition(document) {
        return document.invoice && Statuses.invoice.unpaid.meetsCondition(document.invoice)
      }
    },
    overdue: {
      visible: true,
      name: i18n.t('status.overdue'),
      priority: 8,

      meetsCondition(document) {
        return document.invoice && Statuses.invoice.overdue.meetsCondition(document.invoice)
      }
    }
  },

  /**
   * Credit statuses
   */
  credit: {
    //
  },

  /**
   * Vendor statuses
   * @type {Object}
   */
  vendor: {
    //
  }
}

export default Statuses
