import { uuid, date, float, text, integer } from './data-types'
import billItem from './bill-item'

export default (invoice) => {
  return {
    invoice: {
      client_uuid: uuid(invoice.client_uuid),
      invoice_date: date(invoice.invoice_date),
      due_date: date(invoice.due_date),
      partial: float(invoice.partial),
      currency_id: float(invoice.currency_id),
      invoice_number: text(invoice.invoice_number),
      po_number: text(invoice.po_number),
      discount_type: text(invoice.discount_type),
      discount_value: integer(invoice.discount_value),
      status: text(invoice.status),

      items: invoice.items.map((item) => billItem(item)),

      note_to_client: text(invoice.note_to_client),
      terms: text(invoice.terms),
      footer: text(invoice.footer)
    }
  }
}
