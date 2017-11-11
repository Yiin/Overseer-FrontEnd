import FormMutations from '../base/mutations'

export default FormMutations({
  SET_NEW_CLIENT(state, uuid) {
    state.newClientUuid = uuid
  },
  SET_NEW_INVOICE(state, uuid) {
    state.newInvoiceUuid = uuid
  }
})
