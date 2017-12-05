import i18n from '@/i18n'
import ContextMenuItem from '@/modules/contextmenu/cm-item'
import Statuses from '@/modules/documents/statuses'
import * as actions from '@/modules/documents/actions'

/**
 * Option to open document creation form
 */
export const CREATE_DOCUMENT = new ContextMenuItem({
  title: i18n.t('actions.new_document'),
  icon: 'icon-new-invoice-btn-icon'
})
.addFilter(function () {
  return !this.builder.selectedSpecificRow()
})
.setHandler(function () {
  actions.createDocument(this.builder.getTableStateName())
})

/**
 * Preview selected row
 */
export const PREVIEW = new ContextMenuItem({
  title: i18n.t('actions.preview'),
  icon: {
    type: 'material',
    name: 'remove_red_eye'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.setHandler(function () {
  actions.editDocument(this.builder.getSelectedRow(), this.builder.getTableStateName())
})

/**
 * Edit selected row
 */
export const EDIT_DOCUMENT = new ContextMenuItem({
  title: i18n.t('actions.edit'),
  icon: {
    type: 'material',
    name: 'mode_edit'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})
.addFilter(function () {
  return this.$user.can('edit', this.builder.getSelectedRow())
})
.setHandler(function () {
  actions.editDocument(this.builder.getSelectedRow(), this.builder.getTableStateName())
})

/**
 * Dispatch action to archive selected row
 */
export const ARCHIVE = new ContextMenuItem({
  title: i18n.t('actions.archive'),
  icon: {
    type: 'material',
    name: 'archive'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow() && Statuses.generic.active.meetsCondition(this.builder.getSelectedRow())
})
.setHandler(function () {
  actions.archiveDocument(this.builder.getSelectedRow(), this.builder.getTableStateName())
})

/**
 * Dispatch action to archive selected rows
 */
export const ARCHIVE_MANY = new ContextMenuItem({
  title: i18n.t('actions.archive'),
  icon: {
    type: 'material',
    name: 'archive'
  }
})
.addFilter(function () {
  return this.builder.selectedMoreThanOneRow() && this.builder.atLeastOne(Statuses.generic.active.meetsCondition)
})
.setHandler(function () {
  const uuids = this.builder.getSelection()
    .filter(Statuses.generic.active.meetsCondition)
    .map((row) => row.uuid)

  actions.archiveDocuments(uuids, this.builder.getTableStateName())
})

/**
 * Dispatch action to delete selected row
 */
export const DELETE = new ContextMenuItem({
  title: i18n.t('actions.delete'),
  icon: {
    type: 'material',
    name: 'delete'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow() && !Statuses.generic.deleted.meetsCondition(this.builder.getSelectedRow())
})
.setHandler(function () {
  actions.deleteDocument(this.builder.getSelectedRow(), this.builder.getTableStateName())
})

/**
 * Dispatch action to delete selected rows
 */
export const DELETE_MANY = new ContextMenuItem({
  title: i18n.t('actions.delete'),
  icon: {
    type: 'material',
    name: 'delete'
  }
})
.addFilter(function () {
  return this.builder.selectedMoreThanOneRow() && this.builder.atLeastOne((row) => !Statuses.generic.deleted.meetsCondition(row))
})
.setHandler(function () {
  const uuids = this.builder.getSelection()
    .filter((row) => !Statuses.generic.deleted.meetsCondition(row))
    .map((row) => row.uuid)

  actions.deleteDocuments(uuids, this.builder.getTableStateName())
})

/**
 * Dispatch action to recover selected row
 */
export const RECOVER = new ContextMenuItem({
  title: i18n.t('actions.recover'),
  icon: {
    type: 'material',
    name: 'restore'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow() && Statuses.generic.deleted.meetsCondition(this.builder.getSelectedRow())
})
.setHandler(function () {
  actions.recoverDocument(this.builder.getSelectedRow(), this.builder.getTableStateName())
})

/**
 * Dispatch action to recover selected rows
 */
export const RECOVER_MANY = new ContextMenuItem({
  title: i18n.t('actions.recover'),
  icon: {
    type: 'material',
    name: 'restore'
  }
})
.addFilter(function () {
  return this.builder.selectedMoreThanOneRow() && this.builder.atLeastOne(Statuses.generic.deleted.meetsCondition)
})
.setHandler(function () {
  const uuids = this.builder.getSelection()
    .filter(Statuses.generic.deleted.meetsCondition)
    .map((row) => row.uuid)

  actions.recoverDocuments(uuids, this.builder.getTableStateName())
})

/**
 * Dispatch action to unarchive selected row
 */
export const UNARCHIVE = new ContextMenuItem({
  title: i18n.t('actions.unarchive'),
  icon: {
    type: 'material',
    name: 'restore'
  }
})
.addFilter(function () {
  return this.builder.selectedSpecificRow() && Statuses.generic.archived.meetsCondition(this.builder.getSelectedRow())
})
.setHandler(function () {
  actions.unarchiveDocument(this.builder.getSelectedRow(), this.builder.getTableStateName())
})

/**
 * Dispatch action to unarchive selected rows
 */
export const UNARCHIVE_MANY = new ContextMenuItem({
  title: i18n.t('actions.unarchive'),
  icon: {
    type: 'material',
    name: 'restore'
  }
})
.addFilter(function () {
  return this.builder.selectedMoreThanOneRow() && this.builder.atLeastOne(Statuses.generic.archived.meetsCondition)
})
.setHandler(function () {
  const uuids = this.builder.getSelection()
    .filter(Statuses.generic.archived.meetsCondition)
    .map((row) => row.uuid)

  actions.unarchiveDocuments(uuids, this.builder.getTableStateName())
})
