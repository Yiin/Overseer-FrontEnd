<template>
  <div>
    <breadcrumb :path="['Vendors']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-vendor-btn-icon"></span>
        New Vendor
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      openModal() {
        this.$store.dispatch('openNewModal', {
          title: 'New Vendor',
          component: 'edit-vendor',
          data: {}
        })
      }
    }
  }
</script>