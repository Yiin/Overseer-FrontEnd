<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container>
          <form-inline-select-input v-model="client_uuid" :watch="clients" name="client_uuid" :placeholder="$t('placeholders.type_client_name')" :readonly="preview">
            <inline-option v-if="preview" selected>
              {{ form.client.name }}
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
        Credit details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container>
          <form-row>
            <form-field :label="$t('labels.amount')">
              <!--
                Amount
              -->
              <form-formatted-input
                type="number"
                :label="currency.code"
                v-model="amount"
                name="amount"
                :readonly="preview"
              ></form-formatted-input>
            </form-field>

            <!--
              Currency
            -->
            <form-currency-dropdown v-model="currency_code" :readonly="preview"></form-currency-dropdown>
          </form-row>
          <form-row>

            <!--
              Credit Date
            -->
            <form-field catch-errors="credit_date" :label="$t('labels.credit_date')">
              <form-date-input current-date v-model="credit_date" name="credit_date" :readonly="preview"></form-date-input>
            </form-field>

            <!--
              Credit Number
            -->
            <form-field catch-errors="credit_number" :label="$t('labels.credit_number')">
              <form-text-input v-model="credit_number" name="credit_number" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>
        </form-container>
      </modal-tab>

    </modal-tabs>
  </div>
</template>

<script>
import FormMixin from '@/mixins/FormMixin'
import CurrencyMixin from '@/mixins/CurrencyMixin'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'
import { createDocument } from '@/modules/documents/actions'

export default {
  mixins: [
    CurrencyMixin,
    FormMixin('credit', [
      'client_uuid',
      'amount',
      'currency_code',
      'credit_date',
      'credit_number'
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
        const client = this.form.fields.client || this.clients.find((c) => c.uuid === this.client_uuid)

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
    },

    clients() {
      return this.$store.state.table.clients.items
    }
  },

  methods: {
    createClient() {
      createDocument('client').then((client) => {
        this.$store.dispatch('form/credit/SET_FORM_DATA', {
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