import { uuid, boolean, date, currency, integer, text } from './data-types'
import billItem from './bill-item'

export default (recurringInvoice) => {
  return {
    'recurring-invoice': {
      client_uuid: uuid(recurringInvoice.client_uuid),

      start_date: date(recurringInvoice.start_date),
      end_date: date(recurringInvoice.end_date),
      po_number: text(recurringInvoice.po_number),
      discount_type: text(recurringInvoice.discount_type),
      discount_value: integer(recurringInvoice.discount_value),
      frequency_type: text(recurringInvoice.frequency_type),
      frequency_value: currency(recurringInvoice.frequency_value),
      due_date: integer(recurringInvoice.due_date),
      autobill: boolean(recurringInvoice.autobill),
      currency_code: text(recurringInvoice.currency_code),
      status: text(recurringInvoice.status),

      items: recurringInvoice.items.map((item) => billItem(item)),

      note_to_client: text(recurringInvoice.note_to_client),
      terms: text(recurringInvoice.terms),
      footer: text(recurringInvoice.footer)
    }
  }
}
