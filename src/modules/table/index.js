// documents
import products from './documents/products'
import clients from './documents/clients'
import invoices from './documents/invoices'
import quotes from './documents/quotes'
import expenses from './documents/expenses'
import payments from './documents/payments'
import credits from './documents/credits'
import recurringInvoices from './documents/recurring_invoices'
import vendors from './documents/vendors'
// import taxRates from './documents/tax_rates'

// crm
import projects from './crm/projects'
// import taskLists from './crm/task_lists'
// import tasks from './crm/tasks'

export default {
  namespaced: true,

  modules: {
    // documents
    products,
    clients,
    invoices,
    quotes,
    expenses,
    payments,
    credits,
    recurring_invoices: recurringInvoices,
    vendors,
    // tax_rates: taxRates,

    // crm
    projects
    // task_lists: taskLists,
    // tasks
  }
}
