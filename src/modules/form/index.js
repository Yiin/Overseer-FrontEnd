import product from './product'
import client from './client'
import invoice from './invoice'
import expense from './expense'
import payment from './payment'
import credit from './credit'
import recurringInvoice from './recurring_invoice'

export default {
  namespaced: true,

  modules: {
    product,
    client,
    invoice,
    expense,
    payment,
    credit,
    'recurring_invoice': recurringInvoice
  }
}
