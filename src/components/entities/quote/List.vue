<template>
  <div>
    <breadcrumb :path="['Quotes']"></breadcrumb>

    <div class="table__heading">
      <a @click="openModal" class="button button__create">
        <span class="icon-new-quote-btn-icon"></span>
        New Quote
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      openModal() {
        this.$store.dispatch('openNewModal', {
          title: 'New Quote',
          component: 'edit-quote',
          data: {}
        })
      }
    }
  }
</script>