const HasPdfsMethods = (superclass) => class extends superclass {

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

export default HasPdfsMethods
