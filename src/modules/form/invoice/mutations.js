import * as mutations from './mutation-types'

export default {
  [mutations.SET_CLIENT](state, clientUuid) {
    state.client = clientUuid
  },

  [mutations.SET_INVOICE_DATE](state, invoiceDate) {
    state.invoice_date = invoiceDate
  },

  [mutations.SET_DUE_DATE](state, dueDate) {
    state.due_date = dueDate
  },

  [mutations.SET_PARTIAL](state, partial) {
    state.partial = partial
  },

  [mutations.SET_INVOICE_NUMBER](state, invoiceNumber) {
    state.invoice_number = invoiceNumber
  },

  [mutations.SET_PO_NUMBER](state, poNumber) {
    state.po_number = poNumber
  },

  [mutations.SET_DISCOUNT_TYPE](state, discountType) {
    state.discount.type = discountType
  },

  [mutations.SET_DISCOUNT_VALUE](state, discountValue) {
    state.discount.value = discountValue
  },

  [mutations.SET_ITEMS](state, items) {
    state.items = items
  },

  [mutations.SET_NOTE_TO_CLIENT](state, note) {
    state.note_to_client = note
  },

  [mutations.SET_TERMS](state, terms) {
    state.terms = terms
  },

  [mutations.SET_FOOTER](state, footer) {
    state.footer = footer
  }
}
