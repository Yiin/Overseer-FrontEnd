import S from 'string'
import print from 'print-js'
import $store from '@/store'
import Statuses from '@/modules/documents/statuses'
import ContextMenuAction from './cm-action'

import {
  getTableName
} from '@/modules/documents/helpers'

import {
  createDocument,
  editDocument,
  reviewDocumentState,
  patchDocument,
  archiveDocuments,
  archiveDocument,
  unarchiveDocuments,
  unarchiveDocument,
  deleteDocuments,
  deleteDocument,
  recoverDocuments,
  recoverDocument
} from '@/modules/documents/actions'

/**
 * Get array of selected table rows
 */
function selection(scope) {
  const tableName = getTableName(scope)

  return $store.state.table[tableName].selection
}

/**
 * Get clicked on table row
 */
function selectedRow(scope) {
  return $store.state.table[getTableName(scope)].selectedRow
}

/**
 * visibility filters
 */
export const whenMoreThanOneRowIsSelected = (scope) => {
  return selection(scope).length > 1
}

export const whenSpecificRowIsSelected = (scope) => {
  return !!selectedRow(scope)
}

// static options
export const __SEPARATOR__ = ContextMenuAction({
  isStatic: true,
  isSeparator: true
})

export const SELECTED_ROWS = ContextMenuAction({
  custom: true,
  component: 'cm-item-selected-rows',
  isStatic: true,
  class: 'heading',

  visible(tableName) {
    return whenMoreThanOneRowIsSelected(tableName)
  }
})

export const SELECTED_DOCUMENT = ContextMenuAction({
  custom: true,
  component: 'cm-item-selected-document-name',
  isStatic: true,
  class: 'heading',

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  }
})

export const TableName = ContextMenuAction({
  title: '',
  isStatic: true,
  class: 'heading',

  visible(tableName) {
    return !whenSpecificRowIsSelected(tableName)
  }
})

// Active options
export const CreateDocument = ContextMenuAction({
  documentType: '',

  visible(tableName) {
    return !whenSpecificRowIsSelected(tableName)
  },

  handler: function () {
    createDocument(this.documentType)
  }
})

/**
 * Dispatch action to archive selected row(s)
 */
export const Archive = ContextMenuAction({
  title: 'actions.archive',
  icon: {
    type: 'material',
    name: 'archive'
  },
  moreThanOne: false,

  visible(tableName) {
    if (this.moreThanOne) {
      return selection(tableName).length > 1 && selection(tableName).filter(Statuses.generic.active.meetsCondition).length
    } else {
      return whenSpecificRowIsSelected(tableName) && Statuses.generic.active.meetsCondition(selectedRow(tableName))
    }
  },

  handler(scope) {
    const tableName = getTableName(scope)
    const rows = selection(tableName)

    if (rows.length > 1) {
      const uuids = rows.filter(Statuses.generic.active.meetsCondition).map((row) => row.uuid)

      archiveDocuments(uuids, tableName)
    } else {
      const row = rows[0]

      archiveDocument(row, tableName)
    }
  }
})

/**
 * Dispatch action to delete selected row(s)
 */
export const Delete = ContextMenuAction({
  title: 'actions.delete',
  icon: {
    type: 'material',
    name: 'delete'
  },
  moreThanOne: false,

  visible(tableName) {
    if (this.moreThanOne) {
      return selection(tableName).length > 1 && (
        selection(tableName).filter(Statuses.generic.active.meetsCondition).length ||
        selection(tableName).filter(Statuses.generic.archived.meetsCondition).length
      )
    } else {
      return whenSpecificRowIsSelected(tableName) && (
        Statuses.generic.active.meetsCondition(selectedRow(tableName)) ||
        Statuses.generic.archived.meetsCondition(selectedRow(tableName))
      )
    }
  },

  handler(scope) {
    const rows = selection(scope)

    if (rows.length > 1) {
      const uuids = rows
        .filter((row) => Statuses.generic.active.meetsCondition(row) || Statuses.generic.archived.meetsCondition(row))
        .map((row) => row.uuid)

      deleteDocuments(uuids, scope)
    } else {
      const row = rows[0]

      deleteDocument(row, scope)
    }
  }
})

/**
 * Dispatch action to recover selected row(s)
 */
export const Recover = ContextMenuAction({
  title: 'actions.recover',
  icon: {
    type: 'material',
    name: 'restore'
  },
  moreThanOne: false,

  visible(tableName) {
    if (this.moreThanOne) {
      return selection(tableName).length > 1 && selection(tableName).filter(Statuses.generic.deleted.meetsCondition).length
    } else {
      return whenSpecificRowIsSelected(tableName) && Statuses.generic.deleted.meetsCondition(selectedRow(tableName))
    }
  },

  handler(scope) {
    const uuids = selection(scope)
      .filter(Statuses.generic.deleted.meetsCondition)
      .map((row) => row.uuid)

    if (uuids.length > 1) {
      recoverDocuments(uuids, scope)
    } else {
      recoverDocument(selectedRow(scope), scope)
    }
  }
})

/**
 * Dispatch action to unarchive selected row(s)
 */
export const Unarchive = ContextMenuAction({
  title: 'actions.unarchive',
  icon: {
    type: 'material',
    name: 'restore'
  },
  moreThanOne: false,

  visible(tableName) {
    if (this.moreThanOne) {
      return selection(tableName).length > 1 && selection(tableName).filter(Statuses.generic.archived.meetsCondition).length
    } else {
      return whenSpecificRowIsSelected(tableName) && Statuses.generic.archived.meetsCondition(selectedRow(tableName))
    }
  },

  handler(scope) {
    const uuids = selection(scope)
      .filter(Statuses.generic.archived.meetsCondition)
      .map((row) => row.uuid)

    if (uuids.length > 1) {
      unarchiveDocuments(uuids, scope)
    } else {
      unarchiveDocument(selectedRow(scope), scope)
    }
  }
})

export const PrintDocument = ContextMenuAction({
  title: 'actions.print_document',
  icon: {
    type: 'material',
    name: 'print'
  },

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch }, row) {
    if (typeof row === 'undefined') {
      return
    }
    if (typeof row.pdfs === 'undefined') {
      return
    }
    if (!row.pdfs.length) {
      return
    }
    print(row.getLatestPdf().getFileUrl())
  }
})

/**
 * Preview selected row
 */
export const Preview = ContextMenuAction({
  title: 'actions.preview',
  icon: {
    type: 'material',
    name: 'remove_red_eye'
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    editDocument(selectedRow(tableName), tableName)
  }
})

/**
 * Edit selected row
 */
export const EditDocument = ContextMenuAction({
  title: 'actions.edit',
  icon: {
    type: 'material',
    name: 'mode_edit'
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    editDocument(selectedRow(tableName), tableName)
  }
})

/**
 * Create new Task for selected row
 */
export const NewTask = ContextMenuAction({
  title: 'actions.new_task',
  icon: 'icon-dropdown-new_task',

  visible() {
    return false
  },

  handler() {
    //
  }
})

/**
 * Create new Invoice for selected row
 */
export const NewInvoice = ContextMenuAction({
  title: 'actions.new_invoice',
  icon: 'icon-dropdown-new_invoice',

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    const data = {}
    let tabIndex = 0

    const row = selectedRow(tableName)

    switch (tableName) {
    /**
     * Open invoice creation form with pre-filled
     * client information.
     */
    case 'clients':
      data.client_uuid = row.uuid

      // Skip first modal tab, since we
      // already picked client for the user
      tabIndex = 1
      break

    /**
     * Open invoice creation form with pre-filled
     * quote information
     */
    case 'quotes':
      break
    }
    createDocument('invoice', data, {
      tabIndex
    })
  }
})

export const NewQuote = ContextMenuAction({
  title: 'actions.new_quote',
  icon: 'icon-dropdown-quote',

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    const row = selectedRow(tableName)

    switch (tableName) {
    /**
     * Open quote creation form with pre-filled
     * client information.
     */
    case 'clients':
      createDocument('quote', {
        client_uuid: row.uuid
      }, {
        tabIndex: 1
      })
      break
    default:
      createDocument('quote')
    }
  }
})

export const EnterPayment = ContextMenuAction({
  title: 'actions.enter_payment',
  icon: {
    type: 'material',
    name: 'attach_money'
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    const row = selectedRow(tableName)

    switch (tableName) {
    /**
     * Open payment creation form with pre-filled
     * client information.
     */
    case 'clients':
      createDocument('payment', {
        client_uuid: row.uuid
      }, {
        tabIndex: 1
      })
      break

    case 'invoices':
      createDocument('payment', {
        client_uuid: row.client ? row.client.uuid : null,
        invoice_uuid: row.uuid,
        amount: row.amount.get() - row.paidIn.get(),
        currency_code: row.currency.code
      }, {
        tabIndex: 2
      })
      break
    default:
      createDocument('payment')
    }
  }
})

export const EnterExpense = ContextMenuAction({
  title: 'actions.enter_expense',
  icon: {
    type: 'material',
    name: 'money_off'
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    const row = selectedRow(tableName)

    switch (tableName) {
    /**
     * Open expense creation form with pre-filled
     * document information.
     */
    case 'clients':
      createDocument('expense', {
        client_uuid: row.uuid,
        currency_code: row.currency.code
      })
      break

    case 'vendors':
      createDocument('expense', {
        vendor_uuid: row.uuid,
        currency_code: row.currency.code
      }, {
        tabIndex: 1
      })
      break
    default:
      createDocument('expense')
    }
  }
})

export const EnterCredit = ContextMenuAction({
  title: 'actions.enter_credit',
  icon: {
    type: 'material',
    name: 'card_giftcard'
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    const row = tableName

    switch (tableName) {
    /**
     * Open credit creation form with pre-filled
     * client information.
     */
    case 'clients':
      createDocument('credit', {
        client_uuid: row.uuid
      }, {
        tabIndex: 1
      })
      break
    default:
      createDocument('credit')
    }
  }
})

export const ApplyCredit = ContextMenuAction({
  title: 'actions.apply_credit',
  icon: 'icon-dropdown-credit',

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    const row = selectedRow(tableName)

    createDocument('payment', {
      client_uuid: row.client.uuid,
      payment_type_id: $store.getters['documents/repositories/paymentType/AVAILABLE_ITEMS'].find((type) => {
        return type.name === 'Apply Credit'
      }).id
    }, {
      tabIndex: 1
    })
  }
})

export const CloneDocument = ContextMenuAction({
  title: 'actions.clone_invoice',
  icon: {
    type: 'material',
    name: 'content_copy'
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    createDocument(tableName, Object.assign({}, selectedRow(tableName), { uuid: null }))
  }
})

export const HistoryList = ContextMenuAction({
  isList: true,
  title: 'actions.view_history',
  icon: {
    type: 'material',
    name: 'history'
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  makeList(tableName) {
    const list = selectedRow(tableName).history.map((activity, index) => {
      const action = S(activity.action).capitalize().s
      const date = activity.timestamp.format('MMM D, YYYY')

      return PreviewDocumentState.extend({
        title: `${action} on ${date}`,
        activity: activity,
        isCurrentVersion: !index
      })
    })
    if (list.length > 1) {
      list.splice(1, 0, __SEPARATOR__)
    }

    return list
  }
})

export const PreviewDocumentState = ContextMenuAction({
  custom: true,
  component: 'cm-item-preview-document-state',

  documentState: null,
  handler(tableName) {
    if (!this.isCurrentVersion) {
      reviewDocumentState(this.activity.document.data.uuid, tableName, {
        title: this.title,
        activity: this.activity
      })
    } else {
      editDocument(this.activity.document.data.uuid, tableName)
    }
  }
})

export const MarkSent = ContextMenuAction({
  title: 'actions.mark_sent',
  icon: {
    type: 'material',
    name: 'check'
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName)
  },

  handler(tableName) {
    Statuses.invoice.sent.apply(selectedRow(tableName))
  }
})

export const MarkPaid = ContextMenuAction({
  title: 'actions.mark_paid',
  icon: 'icon-dropdown-mark',

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName) &&
      selectedRow(tableName).paidIn.get() < selectedRow(tableName).amount.get()
  },

  handler(tableName) {
    Statuses.invoice.paid.apply(selectedRow(tableName))
  }
})

export const RefundPayment = ContextMenuAction({
  title: 'actions.refund_payment',
  icon: 'icon-dropdown-refund',

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName) &&
      selectedRow(tableName).refunded.get() < selectedRow(tableName).amount.get()
  },

  handler(tableName) {
    const payment = selectedRow(tableName)

    patchDocument(payment, 'payment', {
      refunded: payment.amount.get()
    })
  }
})

export const ConvertToInvoice = ContextMenuAction({
  title: 'actions.convert_to_invoice',
  icon: {
    class: 'convert-invoice-icon-svg',
    name: ''
  },

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName) && !selectedRow(tableName).invoice
  },

  handler(tableName) {
    const quote = selectedRow(tableName)

    createDocument('invoice', {
      uuid: null,
      client_uuid: quote.client ? quote.client.uuid : null,
      items: quote.items.slice(),
      partial: quote.partial.amount,
      currency_code: quote.currency.code,
      discount_type: quote.discount.serialize().type,
      discount_value: quote.discount.serialize().value,
      note_to_client: quote.noteToClient,
      terms: quote.terms,
      footer: quote.footer
    }, {
      tabIndex: 1
    })
  }
})

export const InvoiceExpense = ContextMenuAction({
  title: 'actions.invoice_expense',
  icon: 'icon-dropdown-expense',

  visible() {
    return false
  },

  handler() {}
})

export const ViewInvoice = ContextMenuAction({
  title: 'actions.view_invoice',
  icon: 'icon-dropdown-refund',

  visible(tableName) {
    return whenSpecificRowIsSelected(tableName) && selectedRow(tableName).invoice
  },

  handler(tableName) {
    editDocument(selectedRow(tableName).invoice, 'invoice')
  }
})
