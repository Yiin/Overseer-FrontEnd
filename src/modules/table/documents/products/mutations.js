import TableMutations from '@/modules/table/base/mutations'

export default TableMutations({
  EXPAND_ROW(state, row) {
    if (state.expandedRow === row) {
      state.expandedRow = undefined
    } else {
      state.expandedRow = row
    }
  }
})
