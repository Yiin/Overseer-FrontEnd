<template>
  <div class="modal-form">
    <modal-tabs @save="save" @fill="fill" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container>
          <form-inline-select-input
            v-if="dropdownOptions.clients.length"
            v-model="client_uuid"
            :items="dropdownOptions.clients"
            :last-item-value="form.newClientUuid"
            :placeholder="$t('placeholders.type_client_name')"
            :readonly="preview"
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
        Credit details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container>
          <form-row>
            <form-field :errors="validationErrors.balance" :label="form.fields.uuid ? $t('labels.balance') : $t('labels.amount')">
              <!--
                Amount
              -->
              <form-formatted-input
                type="number"
                :label="currency.code"
                v-model="balance"
                name="balance"
                :readonly="preview"
              ></form-formatted-input>
            </form-field>

            <!--
              Currency
            -->
            <form-currency-dropdown :Errors="validationErrors.currency_code" v-model="currency_code" :readonly="preview"></form-currency-dropdown>
          </form-row>
          <form-row>

            <!--
              Credit Date
            -->
            <form-field :errors="validationErrors.credit_date" :label="$t('labels.credit_date')">
              <form-date-input current-date v-model="credit_date" name="credit_date" :readonly="preview"></form-date-input>
            </form-field>

            <!--
              Credit Number
            -->
            <form-field :errors="validationErrors.credit_number" :label="$t('labels.credit_number')">
              <form-text-input v-model="credit_number" name="credit_number" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>
        </form-container>
      </modal-tab>
      <template slot="right-buttons--left">
        <div v-show="modal.activeTabIndex === 0" @click="createClient" class="button button--create">
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
    FormMixin('credit', [
      'client_uuid',
      'balance',
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
        const client = this.clients.find((client) => client.uuid === this.client_uuid)

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

  mounted() {
    if (!this.currency_code) {
      this.currency_code = this.currency.code
    }
  },

  methods: {
    createClient() {
      createDocument('client').then((client) => {
        this.$store.commit('form/credit/SET_NEW_CLIENT', client.uuid)
        this.$store.dispatch('form/credit/SET_FORM_DATA', {
          client_uuid: client.uuid
        })
        this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 0)
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
    width: 950px;
  }
}
</style>