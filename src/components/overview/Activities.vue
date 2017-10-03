<template>
  <div class="block block--overview">
    <tabs>
      <activity-tab></activity-tab>
      <payments-tab></payments-tab>
      <expenses-tab></expenses-tab>
      <upcoming-payments-tab></upcoming-payments-tab>
      <overdue-invoices-tab></overdue-invoices-tab>
      <!-- <tasks-tab></tasks-tab> -->
      <projects-tab></projects-tab>
    </tabs>
  </div>
</template>

<script>
import ActivityTab from './tabs/ActivityTab.vue'
import PaymentsTab from './tabs/PaymentsTab.vue'
import ExpensesTab from './tabs/ExpensesTab.vue'
import UpcomingPaymentsTab from './tabs/UpcomingPaymentsTab.vue'
import OverdueInvoicesTab from './tabs/OverdueInvoicesTab.vue'
// import TasksTab from './tabs/TasksTab.vue'
import ProjectsTab from './tabs/ProjectsTab.vue'

export default {
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
}
</style>