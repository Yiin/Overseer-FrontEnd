<template>
  <div>
    <breadcrumb :path="['Recurring Invoices']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-recurring-invoice-btn-icon"></span>
        New Invoice
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      openModal() {
        this.$store.dispatch('openNewModal', {
          title: 'New Recurring Invoice',
          component: 'edit-recurring-invoice',
          data: {}
        })
      }
    }
  }
</script>