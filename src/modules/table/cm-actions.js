import ContextMenuAction from './cm-action'
import pluralize from 'pluralize'
import moment from 'moment'
import $store from '@/store'
import print from '@/vendor/print.js/print.min'
import Statuses from '@/modules/documents/statuses'
import { getFormName } from '@/modules/documents/helpers'

function getSelectedRows(state, tableName, row) {
  let selectedRows = state.table[tableName].selection.length

  if (row) {
    if (!state.table[tableName].selection.find((r) => r.uuid === row.uuid)) {
      selectedRows++
    }
  }
  return selectedRows
}

function showUndoNotification(message, action) {
  return (responseData) => {
    if (Array.isArray(responseData)) {
      $store.dispatch('notification/SHOW', {
        message,
        action: action.bind(null, responseData),
        actionText: 'UNDO'
      })
    } else {
      $store.dispatch('notification/SHOW', {
        message,
        action: action.bind(null, responseData),
        actionText: 'UNDO'
      })
    }
  }
}

// visibility filters
export const whenMoreThanOneRowIsSelected = (tableName, { state }, row) => {
  return getSelectedRows(state, tableName, row) > 1
}

export const whenSpecificRowIsSelected = (tableName, store, row) => {
  return !!row
}

// static options
export const __SEPARATOR__ = ContextMenuAction({
  isStatic: true,
  isSeparator: true
})

export const SELECTED_ROWS = ContextMenuAction({
  isStatic: true,
  isSelectedRowsCounter: true,
  class: 'heading',

  visible(tableName, { state }, row) {
    return getSelectedRows(state, tableName, row) > 1
  }
})

export const SELECTED_DOCUMENT = ContextMenuAction({
  isStatic: true,
  isSelectedDocumentName: true,
  class: 'heading',
  documentType: '',

  visible(tableName, store, row) {
    return !!row
  },

  documentName: function (document) {
    switch (this.documentType) {
    case 'invoice':
      return document.invoice_number
    case 'quote':
      return document.quote_number
    case 'vendor':
      return document.company_name
    }
    return document.name || 'Null'
  }
})

export const TableName = ContextMenuAction({
  isStatic: true,
  class: 'heading',

  visible(tableName, store, row) {
    return !row
  }
})

// Active options
export const CreateDocument = ContextMenuAction({
  visible(tableName, store, row) {
    return !row
  },

  handler: function (meta, { dispatch }) {
    dispatch(`form/${this.documentType}/OPEN_CREATE_FORM`)
  }
})

/**
 * Dispatch action to archive selected row(s)
 */
export const Archive = ContextMenuAction({
  title: 'actions.archive',
  icon: 'icon-dropdown-archive',

  visible(tableName, store, row) {
    return Statuses.generic.active.meetsCondition(row)
  },

  handler({ repositoryPath, tableName }, { dispatch, state }, row) {
    const rows = state.table[tableName].selection.slice()
    if (row && rows.indexOf(row) < 0) {
      rows.push(row)
    }

    if (rows.length > 1) {
      const uuids = rows.map((row) => row.uuid)

      dispatch(`${repositoryPath}/API_ARCHIVE_MANY`, uuids)
        .then(showUndoNotification(`Archived ${uuids.length} documents.`, () => {
          dispatch(`${repositoryPath}/API_UNARCHIVE_MANY`, uuids)
        }))
    } else {
      const row = rows[0]

      dispatch(`${repositoryPath}/API_ARCHIVE`, row)
        .then(showUndoNotification('Archived one document', () => {
          dispatch(`${repositoryPath}/API_UNARCHIVE`, row)
        }))
    }
  }
})

/**
 * Dispatch action to delete selected row(s)
 */
export const Delete = ContextMenuAction({
  title: 'actions.delete',
  icon: 'icon-dropdown-delete',

  visible(tableName, store, row) {
    return Statuses.generic.active.meetsCondition(row)
  },

  handler({ repositoryPath, tableName }, { dispatch, state }, row) {
    const rows = state.table[tableName].selection.slice()
    if (row && rows.indexOf(row) < 0) {
      rows.push(row)
    }

    if (rows.length > 1) {
      const uuids = rows.map((row) => row.uuid)

      dispatch(`${repositoryPath}/API_DELETE_MANY`, uuids)
        .then(showUndoNotification(`Deleted ${uuids.length} documents`, () => {
          dispatch(`${repositoryPath}/API_RESTORE_MANY`, uuids)
        }))
    } else {
      const row = rows[0]

      dispatch(`${repositoryPath}/API_DELETE`, row)
        .then(showUndoNotification('Deleted one document', () => {
          dispatch(`${repositoryPath}/API_RESTORE`, row)
        }))
    }
  }
})

/**
 * Dispatch action to restore selected row(s)
 */
export const Restore = ContextMenuAction({
  title: 'actions.restore',
  icon: 'icon-dropdown-restore',

  visible(tableName, store, row) {
    return !Statuses.generic.active.meetsCondition(row)
  },

  handler({ repositoryPath, tableName }, { dispatch, state }, row) {
    const rows = state.table[tableName].selection.slice()
    if (row && rows.indexOf(row) < 0) {
      rows.push(row)
    }

    if (rows.length > 1) {
      const archivedUuids = rows.filter(Statuses.generic.archived.meetsCondition).map((row) => row.uuid)
      const deletedUuids = rows.filter(Statuses.generic.deleted.meetsCondition).map((row) => row.uuid)

      Promise.all([
        dispatch(`${repositoryPath}/API_RESTORE_MANY`, deletedUuids),
        dispatch(`${repositoryPath}/API_UNARCHIVE_MANY`, archivedUuids)
      ]).then(() => {
        showUndoNotification(`Restored ${archivedUuids.length + deletedUuids.length} documents`, () => {
          dispatch(`${repositoryPath}/API_DELETE_MANY`, deletedUuids)
          dispatch(`${repositoryPath}/API_ARCHIVE_MANY`, archivedUuids)
        })
      })
    } else {
      const row = rows[0]

      if (Statuses.generic.deleted.meetsCondition(row)) {
        dispatch(`${repositoryPath}/API_RESTORE`, row)
          .then(showUndoNotification('Restored one document', () => {
            dispatch(`${repositoryPath}/API_DELETE`, row)
          }))
      } else if (Statuses.generic.archived.meetsCondition(row)) {
        dispatch(`${repositoryPath}/API_UNARCHIVE`, row)
          .then(showUndoNotification('Restored one document', () => {
            dispatch(`${repositoryPath}/API_ARCHIVE`, row)
          }))
      }
    }
  }
})

export const PrintDocument = ContextMenuAction({
  title: 'actions.print_document',
  icon: 'icon-dropdown-mark',

  visible(tableName, store, row) {
    return !!row
  },

  // TODO: Print functionality
  handler(tableName, { dispatch }, row) {
    console.log(row)
    if (typeof row === 'undefined') {
      return
    }
    if (typeof row.pdfs === 'undefined') {
      return
    }
    if (!row.pdfs.length) {
      return
    }
    print('/api/storage/pdf/' + row.pdfs[0].id + '/' + row.pdfs[0].pdfable_id)
  }
})

/**
 * Preview selected row
 */
export const Preview = ContextMenuAction({
  title: 'actions.preview',
  icon: 'icon-dropdown-preview',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch }, row) {
    const formName = pluralize.singular(tableName)
    dispatch(`form/${formName}/OPEN_PREVIEW_FORM`, row)
  }
})

/**
 * Edit selected row
 */
export const EditDocument = ContextMenuAction({
  title: 'actions.edit',
  icon: 'icon-dropdown-edit',

  visible(tableName, store, row) {
    return !!row
  },

  handler({ tableName }, { dispatch }, row) {
    const formName = getFormName(tableName)
    dispatch(`form/${formName}/OPEN_EDIT_FORM`, row)
  }
})

/**
 * Create new Task for selected row
 */
export const NewTask = ContextMenuAction({
  title: 'actions.new_task',
  icon: 'icon-dropdown-new_task',

  visible(tableName, store, row) {
    return row
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

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch }, row) {
    dispatch('form/invoice/OPEN_CREATE_FORM')

    switch (tableName) {
    /**
     * Open invoice creation form with pre-filled
     * client information.
     */
    case 'clients':
      dispatch('form/invoice/SET_FIELD_VALUE', {
        field: 'client_uuid',
        value: row.uuid
      })
      // Skip first modal tab, since we
      // already picked client for the user
      dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
      break

    /**
     * Open invoice creation form with pre-filled
     * quote information
     */
    case 'quotes':
      break
    }
  }
})

export const NewQuote = ContextMenuAction({
  title: 'actions.new_quote',
  icon: 'icon-dropdown-quote',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch }, row) {
    dispatch('form/quote/OPEN_CREATE_FORM')

    switch (tableName) {
    /**
     * Open quote creation form with pre-filled
     * client information.
     */
    case 'clients':
      dispatch('form/quote/SET_FIELD_VALUE', {
        field: 'client_uuid',
        value: row.uuid
      })
      // Skip first modal tab, since we
      // already picked client for the user
      dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
      break
    }
  }
})

export const EnterPayment = ContextMenuAction({
  title: 'actions.enter_payment',
  icon: 'icon-dropdown-payment',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch }, row) {
    dispatch('form/payment/OPEN_CREATE_FORM')

    switch (tableName) {
    /**
     * Open payment creation form with pre-filled
     * client information.
     */
    case 'clients':
      dispatch('form/payment/SET_FIELD_VALUE', {
        field: 'client_uuid',
        value: row.uuid
      })
      // Skip first modal tab, since we
      // already picked client for the user
      dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
      break

    case 'invoices':
      dispatch('form/payment/OPEN_CREATE_FORM')
      dispatch('form/payment/SET_FORM_DATA', {
        client_uuid: row.client ? row.client.uuid : null,
        invoice_uuid: row.uuid,
        amount: row.amount - row.paid_in
      })
      dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 2)
      break
    }
  }
})

export const EnterExpense = ContextMenuAction({
  title: 'actions.enter_expense',
  icon: 'icon-dropdown-expense',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch }, row) {
    dispatch('form/expense/OPEN_CREATE_FORM')

    switch (tableName) {
    /**
     * Open expense creation form with pre-filled
     * document information.
     */
    case 'clients':
      dispatch('form/expense/SET_FORM_DATA', {
        client_uuid: row.uuid,
        currency_code: row.currency_code || null
      })
      break

    case 'vendors':
      dispatch('form/expense/SET_FORM_DATA', {
        vendor_uuid: row.uuid,
        currency_code: row.currency_code || null
      })
      // Skip first modal tab, since we
      // already picked vendor for the user
      dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
      break
    }
  }
})

export const EnterCredit = ContextMenuAction({
  title: 'actions.enter_credit',
  icon: 'icon-dropdown-credit',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch }, row) {
    dispatch('form/credit/OPEN_CREATE_FORM')

    switch (tableName) {
    /**
     * Open credit creation form with pre-filled
     * client information.
     */
    case 'clients':
      dispatch('form/credit/SET_FIELD_VALUE', {
        field: 'client_uuid',
        value: row.uuid
      })
      // Skip first modal tab, since we
      // already picked client for the user
      dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
      break
    }
  }
})

export const ApplyCredit = ContextMenuAction({
  title: 'actions.apply_credit',
  icon: 'icon-dropdown-credit',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch, state }, row) {
    dispatch('form/payment/OPEN_CREATE_FORM')
    dispatch('form/payment/SET_FORM_DATA', {
      client_uuid: row.client.uuid,
      payment_type_id: state.passive.paymentTypes.find((type) => {
        return type.name === 'Apply Credit'
      }).id
    })
    dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
  }
})

export const CloneDocument = ContextMenuAction({
  title: 'actions.clone_invoice',
  icon: 'icon-dropdown-clone',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch, state }, row) {
    const formName = pluralize.singular(tableName)

    dispatch(`form/${formName}/OPEN_CREATE_FORM`)
    dispatch(`form/${formName}/SET_FORM_DATA`, Object.assign({}, row, { uuid: null }))
  }
})

export const ViewHistory = ContextMenuAction({
  title: 'actions.view_history',
  icon: 'icon-dropdown-history',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch, state }, row) { // eslint-disable-line
    //
  }
})

export const MarkSent = ContextMenuAction({
  title: 'actions.mark_sent',
  icon: 'icon-dropdown-mark',

  visible(tableName, store, row) {
    return !!row
  },

  handler(tableName, { dispatch, state }, row) {
    dispatch('form/invoice/SET_FORM_DATA', Object.assign({}, row, { sent_at: moment().unix() }))
    dispatch('table/invoices/SAVE_DOCUMENT', {
      uuid: row.uuid,
      data: {
        invoice: state.form.invoice
      }
    })
  }
})

export const MarkPaid = ContextMenuAction({
  title: 'actions.mark_paid',
  icon: 'icon-dropdown-mark',

  visible(tableName, store, invoice) {
    return invoice && invoice.paid_in < invoice.amount
  },

  handler(tableName, { dispatch, state }, invoice) {
    dispatch('form/invoice/SET_FORM_DATA', Object.assign({}, invoice, { status: 'paid' }))
    dispatch('table/invoices/SAVE_DOCUMENT', {
      uuid: invoice.uuid,
      data: {
        invoice: state.form.invoice
      }
    })
  }
})

export const RefundPayment = ContextMenuAction({
  title: 'actions.refund_payment',
  icon: 'icon-dropdown-refund',

  visible(tableName, store, payment) {
    return payment && payment.refunded < payment.amount
  },

  handler(tableName, { dispatch, state }, payment) {
    dispatch('form/payment/SET_FORM_DATA', Object.assign({}, payment, { refunded: payment.amount }))
    dispatch('table/payments/SAVE_DOCUMENT', {
      uuid: payment.uuid,
      data: {
        payment: state.form.payment
      }
    })
  }
})

export const ConvertToInvoice = ContextMenuAction({
  title: 'actions.convert_to_invoice',
  icon: 'icon-dropdown-convert',

  visible(tableName, { state }, quote) {
    return quote && !quote.invoice
  },

  handler(tableName, { dispatch, state }, quote) {
    if (!quote) {
      return
    }

    dispatch('form/invoice/OPEN_CREATE_FORM')
    dispatch('form/invoice/SET_FORM_DATA', {
      client_uuid: quote.client ? quote.client.uuid : null,
      items: quote.items.slice(),
      partial: quote.partial,
      currency_code: quote.currency_code || null,
      discount_type: quote.discount_type,
      discount_value: quote.discount_value,
      note_to_client: quote.note_to_client,
      terms: quote.terms,
      footer: quote.footer
    })
    dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
  }
})

export const InvoiceExpense = ContextMenuAction({
  title: 'actions.invoice_expense',
  icon: 'icon-dropdown-expense',

  visible(tableName, { state }, expense) {
    let rows = state.table[tableName].selection.slice()
    if (expense && rows.indexOf(expense) < 0) {
      rows.push(expense)
    }
    rows = rows.filter((row) => !row.invoice)
    return rows.length > 0
  },

  handler(tableName, { dispatch, state }, expense) { // eslint-disable-line
    // let rows = state.table[tableName].selection.slice()
    // if (rows.indexOf(expense) < 0) {
    //   rows.push(expense)
    // }
    // rows = rows.filter((row) => !row.invoice)

    // dispatch('form/payment/OPEN_CREATE_FORM')
    // dispatch('form/payment/SET_FORM_DATA', {
    //   expenses: rows.map((row) => row.uuid),
    //   items: rows.map((row) => {
    //     return {
    //       product: row.category
    //     }
    //   })
    // })
    // dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
  }
})

export const ViewInvoice = ContextMenuAction({
  title: 'actions.view_invoice',
  icon: 'icon-dropdown-refund',

  visible(tableName, store, quote) {
    return quote && !!quote.invoice
  },

  handler(tableName, { dispatch, state }, quote) {
    dispatch(`form/invoice/OPEN_EDIT_FORM`, {
      uuid: quote.invoice.uuid,
      data: quote.invoice
    })
  }
})
