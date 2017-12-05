import ContextMenuItem from '@/modules/contextmenu/cm-item'

/**
 * Displays how many rows are currently selected
 */
export const SELECTED_ROWS = new ContextMenuItem({
  isStatic: true,
  isHeading: true
})
.setComponent('cm-item-selected-rows')
.addFilter(function () {
  return this.builder.selectedMoreThanOneRow()
})

/**
 * Displays title of selected document
 */
export const SELECTED_DOCUMENT = new ContextMenuItem({
  isStatic: true,
  isHeading: true
})
.setComponent('cm-item-selected-document-name')
.addFilter(function () {
  return this.builder.selectedSpecificRow()
})

/**
 * Displays name of current table
 */
export const TABLE_NAME = new ContextMenuItem({
  isStatic: true,
  isHeading: true
})
.setComponent('cm-item-table-name')
.addFilter(function () {
  return !this.builder.selectedSpecificRow()
})
