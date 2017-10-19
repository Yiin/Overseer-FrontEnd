<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select vendor
       -->
      <modal-tab :title="$t('tabs.vendor')">
        <form-container>
          <form-inline-select-input v-model="vendor_uuid" :watch="vendors" name="vendor_uuid" :placeholder="$t('placeholders.type_vendor_name')" :readonly="preview">
            <inline-option v-if="preview" selected>
              {{ vendor.company_name }}
            </inline-option>
            <inline-option v-else v-for="vendor in vendors"
                          :key="vendor.uuid"
                          :value="vendor.uuid"
                          :selected="vendor.uuid === vendor_uuid"
            >
              {{ vendor.company_name }}
            </inline-option>
            <div slot="placeholder" class="placeholder-area">
              <div class="placeholder placeholder--vendors"></div>
              <div class="placeholder placeholder--line"></div>
              <div class="placeholder__text">
                Add a new vendor by pressing the button below.
              </div>
              <button @click="createVendor" class="button button--create">
                <span class="icon-new-vendor-btn-icon"></span>
                {{ $t('actions.new_vendor') }}
              </button>
            </div>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container>
          <form-inline-select-input v-model="client_uuid" :watch="clients" name="client_uuid" :placeholder="$t('placeholders.type_client_name')" :readonly="preview">
            <inline-option v-if="preview" selected>
              {{ client.name }}
            </inline-option>
            <inline-option v-else v-for="client in clients"
                          :key="client.uuid"
                          :value="client.uuid"
                          :selected="client.uuid === client_uuid"
            >
              {{ client.name }}
            </inline-option>
            <div slot="placeholder" class="placeholder-area">
              <div class="placeholder placeholder--clients"></div>
              <div class="placeholder placeholder--line"></div>
              <div class="placeholder__text">
                Add a new client by pressing the button below.
              </div>
              <button @click="createClient" class="button button--create">
                <span class="icon-new-client-btn-icon"></span>
                {{ $t('actions.new_client') }}
              </button>
            </div>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <!--
        Expenses Category
       -->
      <!-- <modal-tab :title="$t('tabs.category')">
        <form-container>
          <form-inline-select-input :watch="categories" name="category_uuid" :placeholder="$t('placeholders.type_category_name')">
            <inline-option v-for="category in categories"
                          :key="category.uuid"
                          :value="category.uuid"
                          :selected.once="category.uuid === category_uuid"
            >
              {{ category.name }}
            </inline-option>
          </form-inline-select-input>
        </form-container>
      </modal-tab> -->

      <modal-tab :title="$t('tabs.details')">
        <form-container>
          <form-row>

            <!--
              Cost
            -->
            <form-field :label="$t('labels.amount')" :catch-errors="[ 'amount', 'currency_code' ]" :readonly="preview">
              <form-inputs-group>

                <!--
                  Amount
                -->
                <form-text-input v-model="amount" name="amount" :readonly="preview"></form-text-input>

                <!--
                  Currency
                -->
                <form-currency-dropdown v-model="currency_code" class="dropdown--small" :readonly="preview"></form-currency-dropdown>

              </form-inputs-group>
            </form-field>
          </form-row>
          <form-row>

            <!--
              Date
            -->
            <form-field catch-errors="date" :label="$t('labels.date')">
              <form-date-input current-date v-model="date" name="date" :readonly="preview"></form-date-input>
            </form-field>

            <form-field></form-field>

          </form-row>
        </form-container>
      </modal-tab>

      <!-- <modal-tab :title="$t('tabs.documents')">

      </modal-tab> -->

    </modal-tabs>
  </div>
</template>

<script>
import FormMixin from '@/mixins/FormMixin'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import { createDocument } from '@/modules/documents/actions'

export default {
  mixins: [
    FormMixin('expense', [
      'vendor_uuid',
      'client_uuid',
      'category_uuid',
      'amount',
      'currency_code',
      'date'
    ])
  ],

  components: {
    FormCurrencyDropdown
  },

  computed: {
    vendors() {
      return this.$store.getters['table/vendors/activeItems']
    },

    clients() {
      return this.$store.getters['table/clients/activeItems']
    },

    categories() {
      return this.$store.getters['table/expense_categories/activeItems']
    }
  },

  methods: {
    createVendor() {
      createDocument('vendor').then((vendor) => {
        this.$store.dispatch('form/expense/SET_FORM_DATA', {
          vendor_uuid: vendor.uuid
        })
        this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 0)
      })
    },

    createClient() {
      createDocument('client').then((client) => {
        this.$store.dispatch('form/expense/SET_FORM_DATA', {
          client_uuid: client.uuid
        })
        this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-form {
  display: flex;
  height: 617px;

  .modal-tabs {
    width: 590px;
  }
}
</style>