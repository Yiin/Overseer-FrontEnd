import products from './products'
import clients from './clients'
import invoices from './invoices'
import quotes from './quotes'
import expenses from './expenses'
import payments from './payments'
import credits from './credits'
import recurringInvoices from './recurring_invoices'
import vendors from './vendors'
import taxRates from './tax_rates'

export default {
  namespaced: true,

  modules: {
    products,
    clients,
    invoices,
    quotes,
    expenses,
    payments,
    credits,
    recurring_invoices: recurringInvoices,
    vendors,
    tax_rates: taxRates
  }
}
