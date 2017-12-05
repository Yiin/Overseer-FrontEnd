<template lang="pug">
  .block.block--overview
    tabs
      activity-tab
      payments-tab(v-if='canViewPayments')
      expenses-tab(v-if='canViewExpenses')
      upcoming-payments-tab(v-if='canViewInvoices')
      overdue-invoices-tab(v-if='canViewInvoices')
      projects-tab(v-if='canViewProjects')
</template>

<script>
import AuthorizationHelpersMixin from '@/mixins/authorization/helpers'
import ActivityTab from './tabs/ActivityTab.vue'
import PaymentsTab from './tabs/PaymentsTab.vue'
import ExpensesTab from './tabs/ExpensesTab.vue'
import UpcomingPaymentsTab from './tabs/UpcomingPaymentsTab.vue'
import OverdueInvoicesTab from './tabs/OverdueInvoicesTab.vue'
import ProjectsTab from './tabs/ProjectsTab.vue'

export default {
  mixins: [
    AuthorizationHelpersMixin
  ],

  components: {
    ActivityTab,
    PaymentsTab,
    ExpensesTab,
    UpcomingPaymentsTab,
    OverdueInvoicesTab,
    // TasksTab,
    ProjectsTab
  }
}
</script>

<style lang="scss">
.block--overview {
  margin-top: 27px;
  background: $color-white;
  padding: 0 20px 20px;
  min-height: 590px;
  box-shadow: $box-shadow;
  border-radius: $table-border-radius;
}
</style>