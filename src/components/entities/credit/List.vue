<template>
  <div>
    <breadcrumb :path="['Credits']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-credit-btn-icon"></span>
        New Credit
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      openModal() {
        this.$store.dispatch('openNewModal', {
          title: 'New Credit',
          component: 'edit-credit',
          data: {}
        })
      }
    }
  }
</script>