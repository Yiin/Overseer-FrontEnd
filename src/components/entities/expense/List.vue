<template>
  <div>
    <breadcrumb :path="['Expenses']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-expense-btn-icon"></span>
        New Expense
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      openModal() {
        this.$store.dispatch('openNewModal', {
          title: 'New Expense',
          component: 'edit-expense',
          data: {}
        })
      }
    }
  }
</script>