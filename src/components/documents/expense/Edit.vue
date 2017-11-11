<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select vendor
       -->
      <modal-tab :title="$t('tabs.vendor')">
        <form-container>
          <form-inline-select-input
            v-if="dropdownOptions.vendors.length"
            v-model="vendor_uuid"
            :items="dropdownOptions.vendors"
            :placeholder="$t('placeholders.type_vendor_name')"
          ></form-inline-select-input>

          <div v-else class="placeholder-area">
            <div class="placeholder placeholder--vendors"></div>
            <div class="placeholder placeholder--line"></div>
            <div class="placeholder__text">
              Add a new vendor by pressing the button below.
            </div>
          </div>
        </form-container>
      </modal-tab>

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container>
          <form-inline-select-input
            v-if="dropdownOptions.clients.length"
            v-model="client_uuid"
            :items="dropdownOptions.clients"
            :placeholder="$t('placeholders.type_client_name')"
          ></form-inline-select-input>

          <div v-else class="placeholder-area">
            <div class="placeholder placeholder--clients"></div>
            <div class="placeholder placeholder--line"></div>
            <div class="placeholder__text">
              Add a new client by pressing the button below.
            </div>
          </div>
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
              Amount
            -->
            <form-field :errors="validationErrors.amount" :label="$t('labels.amount')">
              <form-inputs-group>
                <form-formatted-input
                  type="number"
                  :label="currency.code"
                  v-model="amount"
                  name="amount"
                  :readonly="preview"
                ></form-formatted-input>

                <!--
                  Currency
                -->
                <form-currency-dropdown :errors="validationErrors.currency_code" v-model="currency_code" class="half-in-group" :readonly="preview"></form-currency-dropdown>
              </form-inputs-group>
            </form-field>
          </form-row>
          <form-row>

            <!--
              Date
            -->
            <form-field :errors="validationErrors.date" :label="$t('labels.date')">
              <form-date-input current-date v-model="date" name="date" :readonly="preview"></form-date-input>
            </form-field>

            <form-field></form-field>

          </form-row>
        </form-container>
      </modal-tab>

      <template slot="right-buttons--left">
        <div v-show="modal.activeTabIndex === 0" @click="createVendor" class="button button--create">
          <span class="icon-new-vendor-btn-icon"></span>
          {{ $t('actions.new_vendor') }}
        </div>
        <div v-show="modal.activeTabIndex === 1" @click="createClient" class="button button--create">
          <span class="icon-new-client-btn-icon"></span>
          {{ $t('actions.new_client') }}
        </div>
      </template>

    </modal-tabs>
  </div>
</template>

<script>
import FormMixin from '@/mixins/FormMixin'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'
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
    FormCurrencyDropdown,
    FormFormattedInput
  },

  computed: {
    currency() {
      let currency = null

      // use invoices set currency if possible
      if (this.currency_code) {
        currency = this.currencies.find((c) => c.code === this.currency_code)
      }

      // else try to use clients currency
      if (!currency) {
        const client = this.clients.find((c) => c.uuid === this.client_uuid)

        if (client) {
          currency = client.currency
        }
      }

      // or use users preferred currency
      if (!currency) {
        currency = this.$store.state.settings.currency
      }

      // or just default to eur
      if (!currency) {
        currency = {
          code: 'EUR',
          symbol: '€'
        }
      }
      return currency
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
    width: 750px;
  }
}
</style>