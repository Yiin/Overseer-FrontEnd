import { uuid, date, float, text, integer } from './data-types'
import billItem from './bill-item'

export default (quote) => {
  return {
    client_uuid: uuid(quote.client_uuid),
    date: date(quote.quote_date),
    due_date: date(quote.due_date),
    partial: float(quote.partial),
    currency_code: text(quote.currency_code),
    quote_number: text(quote.quote_number),
    po_number: text(quote.po_number),
    discount_type: text(quote.discount_type),
    discount_value: integer(quote.discount_value),
    status: text(quote.status),

    items: quote.items.map((item) => billItem(item)),

    note_to_client: text(quote.note_to_client),
    terms: text(quote.terms),
    footer: text(quote.footer)
  }
}
