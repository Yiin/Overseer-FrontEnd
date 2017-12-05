
const QuoteMethods = (superclass) => class extends superclass {

  getDescriptiveTitle() {
    return this.quoteNumber
  }
}

export default QuoteMethods
