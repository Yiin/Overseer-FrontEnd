<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select vendor
       -->
      <modal-tab :title="$t('tabs.vendor')">
        <form-container name="expense">
          <form-inline-select-input :watch="vendors" name="vendor_uuid" :placeholder="$t('placeholders.type_vendor_name')">
            <inline-option v-for="vendor in vendors"
                          :key="vendor.uuid"
                          :value="vendor.uuid"
                          :selected="vendor.uuid === form.vendor_uuid"
            >
              {{ vendor.company_name }}
            </inline-option>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="expense">
          <form-inline-select-input :watch="clients" name="client_uuid" :placeholder="$t('placeholders.type_client_name')">
            <inline-option v-for="client in clients"
                          :key="client.uuid"
                          :value="client.uuid"
                          :selected="client.uuid === form.client_uuid"
            >
              {{ client.name }}
            </inline-option>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <!--
        Expenses Category
       -->
      <!-- <modal-tab :title="$t('tabs.category')">
        <form-container name="expense">
          <form-inline-select-input :watch="categories" name="category_uuid" :placeholder="$t('placeholders.type_category_name')">
            <inline-option v-for="category in categories"
                          :key="category.uuid"
                          :value="category.uuid"
                          :selected.once="category.uuid === form.category_uuid"
            >
              {{ category.name }}
            </inline-option>
          </form-inline-select-input>
        </form-container>
      </modal-tab> -->

      <modal-tab :title="$t('tabs.details')">
        <form-container name="expense">
          <form-row>

            <!--
              Cost
            -->
            <form-field :label="$t('labels.amount')" :catch-errors="[ 'amount', 'currency_code' ]">
              <form-inputs-group>

                <!--
                  Amount
                -->
                <form-text-input v-model="form.amount" name="amount"></form-text-input>

                <!--
                  Currency
                -->
                <form-currency-dropdown v-model="form.currency_code" class="dropdown--small"></form-currency-dropdown>

              </form-inputs-group>
            </form-field>

            <!--
              Date
            -->
            <form-field catch-errors="date" :label="$t('labels.date')">
              <form-date-input v-model="form.date" name="date"></form-date-input>
            </form-field>

          </form-row>
        </form-container>
      </modal-tab>

      <modal-tab :title="$t('tabs.documents')">

      </modal-tab>

    </modal-tabs>
  </div>
</template>

<script>
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'

export default {
  name: 'edit-expense',

  components: {
    FormCurrencyDropdown
  },

  props: {
    data: {
      default: null
    }
  },

  computed: {
    form() {
      return this.$store.state.form.expense
    },

    passive() {
      return this.$store.state.passive
    },

    vendors() {
      return this.$store.state.table.vendors.items
    },

    clients() {
      return this.$store.state.table.clients.items
    },

    categories() {
      return this.$store.state.table.expense_categories.items
    }
  },

  methods: {
    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/expense/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('form/expense/CREATE')
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-form {
  display: flex;
  height: 617px;

  .modal-tabs {
    width: 990px;
  }
}
</style>