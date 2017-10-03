<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select vendor
       -->
      <modal-tab :title="$t('tabs.vendor')">
        <form-container name="expense">
          <form-inline-select-input :watch="vendors" v-model="form.vendor_uuid" name="vendor_uuid" :placeholder="$t('placeholders.type_vendor_name')" :readonly="preview">
            <inline-option v-if="preview" selected>
              {{ form.vendor.company_name }}
            </inline-option>
            <inline-option v-else v-for="vendor in vendors"
                          :key="vendor.uuid"
                          :value="vendor.uuid"
                          :selected="vendor.uuid === form.vendor_uuid"
            >
              {{ vendor.company_name }}
            </inline-option>
            <div slot="placeholder" class="placeholder-area">
              <div class="placeholder placeholder--vendors"></div>
              <div class="placeholder placeholder--line"></div>
              <div class="placeholder__text">
                Add a new vendor by pressing the button below.
              </div>
              <a @click="createVendor" class="button button--create">
                <span class="icon-new-vendor-btn-icon"></span>
                {{ $t('actions.new_vendor') }}
              </a>
            </div>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="expense">
          <form-inline-select-input :watch="clients" name="client_uuid" :placeholder="$t('placeholders.type_client_name')" :readonly="preview">
            <inline-option v-if="preview" selected>
              {{ form.client.name }}
            </inline-option>
            <inline-option v-else v-for="client in clients"
                          :key="client.uuid"
                          :value="client.uuid"
                          :selected="client.uuid === form.client_uuid"
            >
              {{ client.name }}
            </inline-option>
            <div slot="placeholder" class="placeholder-area">
              <div class="placeholder placeholder--clients"></div>
              <div class="placeholder placeholder--line"></div>
              <div class="placeholder__text">
                Add a new client by pressing the button below.
              </div>
              <a @click="createClient" class="button button--create">
                <span class="icon-new-client-btn-icon"></span>
                {{ $t('actions.new_client') }}
              </a>
            </div>
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
            <form-field :label="$t('labels.amount')" :catch-errors="[ 'amount', 'currency_id' ]" :readonly="preview">
              <form-inputs-group>

                <!--
                  Amount
                -->
                <form-text-input v-model="form.amount" name="amount" :readonly="preview"></form-text-input>

                <!--
                  Currency
                -->
                <form-currency-dropdown v-model="form.currency_id" class="dropdown--small" :readonly="preview"></form-currency-dropdown>

              </form-inputs-group>
            </form-field>
          </form-row>
          <form-row>

            <!--
              Date
            -->
            <form-field catch-errors="date" :label="$t('labels.date')">
              <form-date-input current-date v-model="form.date" name="date" :readonly="preview"></form-date-input>
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
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import { createDocument } from '@/modules/documents/actions'

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

    preview() {
      return this.form.__preview
    },

    passive() {
      return this.$store.state.passive
    },

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
        this.$store.dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', 0)
      })
    },

    createClient() {
      createDocument('client').then((client) => {
        this.$store.dispatch('form/expense/SET_FORM_DATA', {
          client_uuid: client.uuid
        })
        this.$store.dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', 1)
      })
    },

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
    width: 590px;
  }
}
</style>