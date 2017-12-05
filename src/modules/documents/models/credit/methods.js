
const CreditMethods = (superclass) => class extends superclass {
  getDescriptiveTitle() {
    return this.amount.format() + ' for ' + this.client.getTitle()
  }
}

export default CreditMethods
