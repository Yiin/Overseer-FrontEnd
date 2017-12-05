
const PaymentMethods = (superclass) => class extends superclass {

  getDescriptiveTitle() {
    return this.amount.format() + ' for invoice ' + this.invoice.getTitle()
  }
}

export default PaymentMethods
