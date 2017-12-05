import ContextMenuBuilder from '@/modules/contextmenu/cm-builder'
import store from '@/store'

/**
 * Builds a context menu specifically for table
 */
class TableContextMenuBuilder extends ContextMenuBuilder {
  init(props) {
    this.state = store.state.table[props.tableStateName]

    return super.init(props)
  }

  getTableStateName() {
    return this.props.tableStateName
  }

  getSelectedRow() {
    return this.state.selectedRow
  }

  getSelection() {
    return this.state.selection
  }

  /**
   * Filters
   *
   * Checks if we have selected more than one row
   */
  selectedMoreThanOneRow() {
    return this.state.selection.length > 1
  }

  /**
   * Checks if we have clicked on specific row
   * and not outside of table
   */
  selectedSpecificRow() {
    return this.state.selectedRow !== null
  }

  /**
   * Checks if at least one row matches the condition
   */
  atLeastOne(condition) {
    return this.getSelection().filter(condition).length > 0
  }
}

export default TableContextMenuBuilder
