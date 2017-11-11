/**
 * @mixin
 */
const HasPdfs = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args)

    this.pdfs = []
  }

  assignPdf(pdf) {
    this.pdfs.push(pdf)
  }

  getLatestPdf() {
    if (!this.pdfs.length) {
      return undefined
    }
    return this.pdfs[this.pdfs.length - 1]
  }
}

export default HasPdfs
