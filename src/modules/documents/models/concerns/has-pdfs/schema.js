import Pdf from '../../pdf'

const HasPdfsSchema = (superclass) => class extends superclass {

  static parse(data) {
    return Object.assign(super.parse(data), {
      pdfs: (data.pdfs || []).map(Pdf.create, Pdf)
    })
  }
}

export default HasPdfsSchema
