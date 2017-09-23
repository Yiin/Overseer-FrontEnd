import product from './product'
import client from './client'
import invoice from './invoice'
import quote from './quote'
import expense from './expense'
import payment from './payment'
import credit from './credit'
import recurringInvoice from './recurring_invoice'
import vendor from './vendor'
import project from './project'

export default {
  namespaced: true,

  modules: {
    product,
    client,
    invoice,
    quote,
    expense,
    payment,
    credit,
    'recurring_invoice': recurringInvoice,
    vendor,
    project
  }
}
