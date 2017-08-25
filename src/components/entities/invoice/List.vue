<template>
  <div>
    <breadcrumb :path="['Invoices']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-invoice-btn-icon"></span>
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
          title: 'New Invoice',
          component: 'edit-invoice',
          data: {}
        })
      }
    }
  }
</script>