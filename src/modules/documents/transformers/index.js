import product from './product'
import client from './client'
import credit from './credit'
import expense from './expense'
import invoice from './invoice'
import quote from './quote'
import recurringInvoice from './recurring-invoice'
import payment from './payment'
import vendor from './vendor'
import project from './project'

export default {
  namespaced: true,

  product,
  client,
  credit,
  expense,
  invoice,
  quote,
  'recurring_invoice': recurringInvoice,
  payment,
  vendor,
  project
}
