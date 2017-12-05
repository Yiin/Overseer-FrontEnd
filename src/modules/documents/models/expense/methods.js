
const ExpenseMethods = (superclass) => class extends superclass {
  getDescriptiveTitle() {
    return this.amount.format() + ' for vendor ' + this.vendor.getTitle()
  }
}

export default ExpenseMethods
