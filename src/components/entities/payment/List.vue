<template>
  <div>
    <breadcrumb :path="['Payments']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-payment-btn-icon"></span>
        New Payment
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      openModal() {
        this.$store.dispatch('openNewModal', {
          title: 'New Payment',
          component: 'edit-payment',
          data: {}
        })
      }
    }
  }
</script>