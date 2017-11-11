import Model from './model'
import moment from 'moment'

class Pdf extends Model {
  static create(data) {
    return new Pdf(
      Pdf.parse(data)
    )
  }

  getFileUrl() {
    return `/storage/pdf/${this.id}/${this.filename}`
  }

  /**
   * Parse pdf data that came from api
   */
  static parse(data) {
    const modelData = {}

    modelData.id = data.id
    modelData.filename = data.filename

    modelData.pdfableType = data.pdfable_type
    modelData.pdfableId = data.pdfable_id

    modelData.createdAt = data.created_at && moment(data.created_at.date)

    return modelData
  }
}

export default Pdf
