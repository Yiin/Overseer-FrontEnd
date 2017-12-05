import i18n from '@/i18n'
import TableContextMenuBuilder from '@/modules/table/contextmenu/builder'
import ContextMenuItem from '@/modules/contextmenu/cm-item'
import Statuses from '@/modules/documents/statuses'
import * as actions from '@/modules/documents/actions'

/**
 * Print latest pdf of selected document
 */
export const PRINT_DOCUMENT = new ContextMenuItem({
  title: i18n.t('actions.print_document'),
  icon: {
    type: 'material',
    name: 'print'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.setHandler(function () {
  const pdf = this.builder.getSelectedRow().getLatestPdf()

  if (pdf) {
    console.log('printing', pdf.getFileUrl())
    print(pdf.getFileUrl())
  }
})

/**
 * Create new Task for selected row
 */
export const NEW_TASK = new ContextMenuItem({
  title: i18n.t('actions.new_task'),
  icon: 'icon-dropdown-new_task'
})
.addFilter(function () {
  return false
})

/**
 * Create new Invoice for selected row
 */
export const NEW_INVOICE = new ContextMenuItem({
  title: i18n.t('actions.new_invoice'),
  icon: 'icon-dropdown-new_invoice'
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('create', 'invoice')
})
.setHandler(function () {
  const formData = {}
  let tabIndex = 0

  const row = this.builder.getSelectedRow()

  switch (this.builder.getTableStateName()) {
  /**
   * Open invoice creation form with pre-filled
   * client information.
   */
  case 'clients':
    formData.client_uuid = row.uuid

    // Skip first modal tab, since we
    // already picked client for the user
    tabIndex = 1
    break
  }
  actions.createDocument('invoice', formData, {
    tabIndex
  })
})

/**
 * Open create form for new quote with
 * prefilled information
 */
export const NEW_QUOTE = new ContextMenuItem({
  title: i18n.t('actions.new_quote'),
  icon: 'icon-dropdown-quote'
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('create', 'quote')
})
.setHandler(function () {
  actions.createDocument('quote', {
    client_uuid: this.builder.getSelectedRow().uuid
  }, {
    tabIndex: 1
  })
})

/**
 * Open create form for new payment with
 * prefilled information
 */
export const ENTER_PAYMENT = new ContextMenuItem({
  title: i18n.t('actions.enter_payment'),
  icon: {
    type: 'material',
    name: 'attach_money'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('create', 'payment')
})
.setHandler(function () {
  const row = this.builder.getSelectedRow()

  switch (this.builder.getTableStateName()) {
  /**
   * Create payment that came from selected client
   */
  case 'clients':
    actions.createDocument('payment', {
      client_uuid: row.uuid
    }, {
      tabIndex: 1
    })
    break

  /**
   * Create payment for selected invoice
   */
  case 'invoices':
    actions.createDocument('payment', {
      client_uuid: row.client ? row.client.uuid : null,
      invoice_uuid: row.uuid,
      amount: row.amount.get() - row.paidIn.get(),
      currency_code: row.currency.code
    }, {
      tabIndex: 2
    })
    break
  default:
    actions.createDocument('payment')
  }
})

/**
 * Open expense creation form
 */
export const ENTER_EXPENSE = new ContextMenuItem({
  title: i18n.t('actions.enter_expense'),
  icon: {
    type: 'material',
    name: 'money_off'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('create', 'expense')
})
.setHandler(function () {
  const row = this.builder.getSelectedRow()

  switch (this.builder.getTableStateName()) {
  /**
   * Expense from client
   */
  case 'clients':
    actions.createDocument('expense', {
      client_uuid: row.uuid,
      currency_code: row.currency.code
    })
    break

  /**
   * Expense from vendor
   */
  case 'vendors':
    actions.createDocument('expense', {
      vendor_uuid: row.uuid,
      currency_code: row.currency.code
    }, {
      tabIndex: 1
    })
    break
  default:
    actions.createDocument('expense')
  }
})

/**
 * Open credit creation form
 */
export const ENTER_CREDIT = new ContextMenuItem({
  title: i18n.t('actions.enter_credit'),
  icon: {
    type: 'material',
    name: 'card_giftcard'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('create', 'credit')
})
.setHandler(function () {
  const row = this.builder.getSelectedRow()

  switch (this.builder.getTableStateName()) {
  /**
   * Open credit creation form with pre-filled
   * client information.
   */
  case 'clients':
    actions.createDocument('credit', {
      client_uuid: row.uuid
    }, {
      tabIndex: 1
    })
    break
  default:
    actions.createDocument('credit')
  }
})

/**
 * Open document creation form with prefilled
 * data of selected document
 */
export const CLONE_DOCUMENT = new ContextMenuItem({
  title: i18n.t('actions.clone_document'),
  icon: {
    type: 'material',
    name: 'content_copy'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('create', this.builder.getTableStateName())
})
.setHandler(function () {
  actions.createDocument(
    this.builder.getTableStateName(),
    Object.assign({}, this.builder.getSelectedRow().serialize({
      fresh: true
    }))
  )
})

/**
 * Show recent activity of selected document
 */
export const HISTORY_LIST = new ContextMenuItem({
  component: 'cm-item-list',
  title: i18n.t('actions.view_history'),
  icon: {
    type: 'material',
    name: 'history'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.setHandler(function () {
  /**
   * Create new context menu items list
   */
  const builder = new TableContextMenuBuilder()
  const list = builder.init({
    tableStateName: this.builder.getTableStateName()
  })

  this.builder.getSelectedRow().history.forEach((activity, index) => {
    const item = PREVIEW_DOCUMENT_STATE.extend({
      title: activity.getTitle(),
      activity: activity,
      isCurrentVersion: !index
    })
    list.addItem(item)
  })
  /**
   * If this document has more than 1 record of activity,
   * insert separator after first item, so we can
   * separate current document state from previous ones
   */
  if (this.builder.getSelectedRow().history.length > 1) {
    list.addSeparator(1)
  }

  return list.build()
})

/**
 * Opens either review form with document data from previous state
 * or edit form with current data
 */
export const PREVIEW_DOCUMENT_STATE = new ContextMenuItem({
  component: 'cm-item-preview-document-state'
})
.setHandler(function () {
  if (!this.props.isCurrentVersion) {
    actions.reviewDocumentState(this.props.activity.document.data.uuid, this.builder.getTableStateName(), {
      title: this.props.title,
      activity: this.props.activity
    })
  } else {
    actions.editDocument(this.props.activity.document.data.uuid, this.builder.getTableStateName())
  }
})

/**
 * Mark invoice as sent
 */
export const MARK_SENT = new ContextMenuItem({
  title: i18n.t('actions.mark_sent'),
  icon: {
    type: 'material',
    name: 'check'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('edit', this.builder.getTableStateName())
})
.setHandler(function () {
  Statuses.invoice.sent.apply(this.builder.getSelectedRow())
})

export const MARK_PAID = new ContextMenuItem({
  title: i18n.t('actions.mark_paid'),
  icon: 'icon-dropdown-mark'
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('edit', this.getTableStateName())
})
.addFilter(function () {
  return this.builder.getSelectedRow().paidIn.get() < this.builder.getSelectedRow().amount.get()
})
.setHandler(function () {
  Statuses.invoice.paid.apply(this.builder.getSelectedRow())
})

/**
 * Refund payment
 */
export const REFUND_PAYMENT = new ContextMenuItem({
  title: i18n.t('actions.refund_payment'),
  icon: 'icon-dropdown-refund'
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('edit', 'payment')
})
.addFilter(function () {
  return this.builder.getSelectedRow().refunded.get() < this.builder.getSelectedRow().amount.get()
})
.setHandler(function () {
  const payment = this.getSelectedRow()

  actions.patchDocument(payment, 'payment', {
    refunded: payment.amount.get()
  })
})

/**
 * Convert document to invoice
 */
export const CONVERT_TO_INVOICE = new ContextMenuItem({
  title: i18n.t('actions.convert_to_invoice'),
  icon: {
    class: 'convert-invoice-icon-svg',
    name: ''
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow() && !this.builder.getSelectedRow().invoice
})
.addFilter(function () {
  return this.$user.can('create', 'invoice')
})
.setHandler(function () {
  const copy = this.builder.getSelectedRow().serialize()

  actions.createDocument('invoice', {
    uuid: null,
    client_uuid: copy.client_uuid,
    items: copy.items,
    partial: copy.partial,
    currency_code: copy.currency_code,
    discount_type: copy.discount_type,
    discount_value: copy.discount_value,
    applied_credits: copy.applied_credits,
    note_to_client: copy.note_to_client,
    terms: copy.terms,
    footer: copy.footer
  }, {
    tabIndex: 1
  })
})

export const INVOICE_EXPENSE = new ContextMenuItem({
  title: i18n.t('actions.invoice_expense'),
  icon: 'icon-dropdown-expense'
})
.addFilter(function () {
  return false
})
.addFilter(function () {
  return this.$user.can('create', 'invoice')
})

export const VIEW_INVOICE = new ContextMenuItem({
  title: i18n.t('actions.view_invoice'),
  icon: 'icon-dropdown-refund'
})
.addFilter(function () {
  return this.builder.selectedSpecificRow() && this.builder.getSelectedRow().invoice
})
.addFilter(function () {
  return this.$user.can('view', this.builder.getSelectedRow().invoice)
})
.setHandler(function () {
  actions.editDocument(this.builder.getSelectedRow().invoice, 'invoice')
})
