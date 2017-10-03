<template>
  <div>
    <tabs :tab="currentLayout" no-tabs>
      <tab title="Invoices">
        <invoices-layout :current-layout="currentLayout" @change="changeLayout"></invoices-layout>
      </tab>
      <tab title="Recurring">
        <recurring-layout :current-layout="currentLayout" @change="changeLayout"></recurring-layout>
      </tab>
    </tabs>
  </div>
</template>

<script>
import InvoicesLayout from './layouts/InvoicesLayout.vue'
import RecurringLayout from './layouts/RecurringLayout.vue'

export default {
  components: {
    InvoicesLayout,
    RecurringLayout
  },

  data() {
    return {
      currentLayout: 'Invoices'
    }
  },

  methods: {
    changeLayout(layout) {
      this.currentLayout =
        layout === 'Recurring'
        ? 'Recurring'
        : 'Invoices'
    }
  }
}
</script>