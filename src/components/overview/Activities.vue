<template lang="pug">
  .block.block--default
    tabs
      tab-dropdown
        all-activity-tab
        payments-activity-tab(v-if='canViewPayments')
        invoices-activity-tab(v-if='canViewInvoices')
        expenses-activity-tab(v-if='canViewExpenses')
        quotes-activity-tab(v-if='canViewQuotes')
        clients-activity-tab(v-if='canViewClients')
        credits-activity-tab(v-if='canViewCredits')
        products-activity-tab(v-if='canViewProducts')
        vendors-activity-tab(v-if='canViewVendors')
        employees-activity-tab(v-if='canViewEmployees')
        projects-activity-tab(v-if='canViewProjects' tab-key='projects-activity')
        tasks-activity-tab(v-if='canViewProjects' tab-key='tasks-activity')
      upcoming-payments-tab(v-if='canViewInvoices')
      overdue-invoices-tab(v-if='canViewInvoices')
      projects-tab(v-if='canViewProjects')
      tasks-tab(v-if='canViewProjects')
</template>

<script>
import AuthorizationHelpersMixin from '@/mixins/authorization/helpers'

import AllActivityTab from './tabs/activity/All.vue'
import PaymentsActivityTab from './tabs/activity/payments'
import ExpensesActivityTab from './tabs/activity/expenses'
import InvoicesActivityTab from './tabs/activity/invoices'
import CreditsActivityTab from './tabs/activity/credits'
import QuotesActivityTab from './tabs/activity/quotes'
import ClientsActivityTab from './tabs/activity/clients'
import ProductsActivityTab from './tabs/activity/products'
import VendorsActivityTab from './tabs/activity/vendors'
import EmployeesActivityTab from './tabs/activity/employees'
import ProjectsActivityTab from './tabs/activity/projects'
import TasksActivityTab from './tabs/activity/tasks'

import UpcomingPaymentsTab from './tabs/UpcomingPaymentsTab.vue'
import OverdueInvoicesTab from './tabs/OverdueInvoicesTab.vue'
import ProjectsTab from './tabs/ProjectsTab.vue'
import TasksTab from './tabs/TasksTab.vue'

export default {
  mixins: [
    AuthorizationHelpersMixin
  ],

  components: {
    AllActivityTab,
    PaymentsActivityTab,
    ExpensesActivityTab,
    InvoicesActivityTab,
    CreditsActivityTab,
    QuotesActivityTab,
    ClientsActivityTab,
    ProductsActivityTab,
    VendorsActivityTab,
    EmployeesActivityTab,
    ProjectsActivityTab,
    TasksActivityTab,

    UpcomingPaymentsTab,
    OverdueInvoicesTab,
    ProjectsTab,
    TasksTab
  }
}
</script>