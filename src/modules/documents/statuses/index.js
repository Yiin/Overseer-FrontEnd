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
  checkForQuoteMailingConflicts
} from './quote-conflicts'

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
        return document.archivedAt && !Statuses.generic.deleted.meetsCondition(document)
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
        return !!document.deletedAt
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
        return Statuses.generic.active.meetsCondition(document) && document.status === 'draft'
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
        return Statuses.generic.active.meetsCondition(document) && document.status === 'pending'
      },

      /**
       * Mark invoice as pending
       */
      apply(invoice, status) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(invoice, 'invoice'))
        conflicts = conflicts.concat(checkForInvoiceMailingConflicts(invoice, status || 'pending'))
        conflicts = conflicts.concat(checkForExistingPaymentsConflict(invoice, status || 'pending'))
        conflicts = conflicts.concat(checkForPaidInvoiceConflicts(invoice, status || 'pending'))
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
        return Statuses.generic.active.meetsCondition(document) && document.status === 'sent'
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
        return Statuses.generic.active.meetsCondition(document) && document.status === 'viewed'
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
          invoice.paidIn.get() > 0 &&
          invoice.paidIn.get() < invoice.amount.get() &&
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
                message: i18n.t('text.create_a_payment_with_amount_less_than_x', { x: invoice.amount.get() - invoice.paidIn.get() }),
                solve() {
                  createDocument('payment', {
                    client_uuid: invoice.client.uuid,
                    invoice_uuid: invoice.uuid
                  }, {
                    tabIndex: 2
                  })
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
        return document.dueDate && moment().isAfter(document.dueDate)
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
                  editDocument(invoice, 'invoice', {
                    tabIndex: 1
                  })
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
        return document.paidIn.get() >= document.amount.get()
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
                message: i18n.t('text.create_a_payment_of_x_or_more', { x: invoice.amount.get() - invoice.paidIn.get() }),
                solve() {
                  createDocument('payment', {
                    client_uuid: invoice.client.uuid,
                    invoice_uuid: invoice.uuid,
                    amount: invoice.amount.get() - invoice.paidIn.get(),
                    currency_code: invoice.currency.code
                  }, {
                    tabIndex: 2
                  })
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
        return document.refunded.get() > 0
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
      },

      apply(quote) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(quote, 'quote'))

        return {
          conflicts,
          solve() {
            quote.status = 'draft'
            return patchDocument(quote, 'quotes', { status: 'draft' })
          }
        }
      }
    },

    /**
     * Pending
     *
     * Quote is queued to be sent.
     */
    pending: {
      visible: true,
      name: i18n.t('status.pending'),
      priority: 1,

      meetsCondition(document) {
        return document.status === 'pending'
      },

      /**
       * Mark quote as pending
       */
      apply(quote, status) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(quote, 'quote'))
        conflicts = conflicts.concat(checkForQuoteMailingConflicts(quote, status || 'pending'))

        return {
          conflicts,
          solve() {
            quote.status = 'pending'
            return patchDocument(quote, 'quotes', { status: 'pending' })
          }
        }
      }
    },

    /**
     * Sent
     *
     * Quote is sent
     */
    sent: {
      visible: true,
      name: i18n.t('status.sent'),
      priority: 2,

      meetsCondition(document) {
        return document.status === 'sent'
      },

      /**
       * Mark quote as sent, but do not actually send one.
       */
      apply(quote) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(quote, 'quote'))

        return {
          conflicts,
          solve() {
            quote.status = 'sent'
            return patchDocument(quote, 'quotes', { status: 'sent' })
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
       * Mark quote as pending
       */
      apply(quote) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(quote, 'quote'))

        return {
          conflicts,
          solve() {
            quote.status = 'viewed'
            return patchDocument(quote, 'quotes', { status: 'viewed' })
          }
        }
      }
    },

    approved: {
      visible: true,
      name: i18n.t('status.approved'),
      priority: 3,

      meetsCondition(document) {
        return document.status === 'approved'
      },

      apply(quote) {
        let conflicts = []

        conflicts = conflicts.concat(checkForGenericConflicts(quote, 'quote'))

        return {
          conflicts,
          solve() {
            quote.status = 'approved'
            return patchDocument(quote, 'quotes', { status: 'approved' })
          }
        }
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
        return document.invoice
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

export const is = (type, document, statuses) => {
  statuses = [].concat(statuses)

  for (let i = 0; i < statuses.length; ++i) {
    const status = statuses[i]

    if (Statuses[type][status].meetsCondition(document)) {
      return true
    }
  }
  return false
}

export const isNot = (type, document, statuses) => {
  statuses = [].concat(statuses)

  for (let i = 0; i < statuses.length; ++i) {
    const status = statuses[i]

    if (Statuses[type][status].meetsCondition(document)) {
      return false
    }
  }
  return true
}

export default Statuses
