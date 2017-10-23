<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select client who made the payment
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
        Select invoice the payment is made for
       -->
      <modal-tab :title="$t('tabs.invoice')">
        <form-container>
          <form-inline-table-select
            v-if="clientInvoices.length"
            v-model="invoice_uuid"
            :items="clientInvoices"
            item-value="uuid"
            :placeholder="$t('placeholders.type_invoice_number')"
            :columns="[
              { width: '25%', title: $t('fields.invoice_number') },
              { width: '24%', title: $t('fields.client_name') },
              { width: '18%', title: $t('fields.total_amount') },
              { width: '18%', title: $t('fields.paid_in') },
              { width: '15%', title: $t('fields.status'), align: 'center' }
            ]"
          >
            <template slot="column-0" slot-scope="{ item }">
              {{ item.invoiceNumber }}
            </template>
            <template slot="column-1" slot-scope="{ item }">
              {{ item.client.name }}
            </template>
            <template slot="column-2" slot-scope="{ item }">
              <span class="currency">{{ item.currency | currencySymbol }}</span>
              <span class="currency currency--primary">{{ item.amount.amount | currency }}</span>
            </template>
            <template slot="column-3" slot-scope="{ item }">
              <span class="currency">{{ item.currency | currencySymbol }}</span>
              <span class="currency currency--secondary">{{ item.paidIn.amount | currency }}</span>
            </template>
            <template slot="column-4" slot-scope="{ item }">
              <span class="status" :class="[ 'status--' + $options.filters.invoiceStatus(item) ]">
                {{ item | invoiceStatus }}
              </span>
            </template>
          </form-inline-table-select>

          <div v-else class="placeholder-area">
            <div class="placeholder placeholder--invoices"></div>
            <div class="placeholder placeholder--line"></div>
            <div class="placeholder__text">
              Add a new invoice by pressing the button below.
            </div>
          </div>
        </form-container>
      </modal-tab>

      <!--
        Invoice details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container>
          <form-row>
            <form-field :catch-errors="[ 'amount', 'currency_code' ]" :label="$t('labels.amount')">
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
                <form-currency-dropdown v-model="currency_code" class="half-in-group" :readonly="preview"></form-currency-dropdown>
              </form-inputs-group>
            </form-field>
            <form-field :label="$t('labels.payment_type')">
              <form-dropdown-input
                v-model="payment_type_id"
                :items="dropdownOptions.paymentTypes"
                :placeholder="$t('labels.payment_type')"
              ></form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>

            <!--
              Payment Date
            -->
            <form-field catch-errors="payment_date" :label="$t('labels.payment_date')">
              <form-date-input current-date v-model="payment_date" name="payment_date" :readonly="preview"></form-date-input>
            </form-field>

            <!--
              Payment Reference
            -->
            <form-field catch-errors="payment_reference" :label="$t('labels.payment_reference')">
              <form-text-input v-model="payment_reference" name="payment_reference" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>

      <template slot="right-buttons--left">
        <div v-show="modal.activeTabIndex === 0" @click="createClient" class="button button--create">
          <span class="icon-new-client-btn-icon"></span>
          {{ $t('actions.new_client') }}
        </div>
        <div v-show="modal.activeTabIndex === 1" @click="createInvoice" class="button button--create">
          <span class="icon-new-invoice-btn-icon"></span>
          {{ $t('actions.new_invoice') }}
        </div>
      </template>

    </modal-tabs>
  </div>
</template>

<script>
import FormMixin from '@/mixins/FormMixin'
import FormInlineTableSelect from '@/components/common/Form/FormInlineTableSelect.vue'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'
import { createDocument } from '@/modules/documents/actions'

export default {
  mixins: [
    FormMixin('payment', [
      'client_uuid',
      'invoice_uuid',
      'amount',
      'currency_code',
      'payment_type_id',
      'payment_date',
      'payment_reference'
    ])
  ],

  components: {
    FormInlineTableSelect,
    FormCurrencyDropdown,
    FormFormattedInput
  },

  computed: {
    clientInvoices() {
      if (this.client_uuid) {
        return this.invoices.filter((invoice) => invoice.client.uuid === this.client_uuid)
      } else {
        return this.invoices
      }
    },

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

  watch: {
    client_uuid(clientUuid) {
      if (clientUuid) {
        if (!this.clientInvoices.find((invoice) => invoice.uuid === this.invoice_uuid)) {
          const invoice = this.invoices.find((invoice) => invoice.client.uuid === clientUuid)

          this.$store.dispatch('form/payment/SET_FORM_DATA', {
            invoice_uuid: invoice ? invoice.uuid : null
          })
        }
      }
    },

    invoice_uuid(invoiceUuid) {
      if (invoiceUuid && !this.client_uuid) {
        const invoice = this.invoices.find((invoice) => invoice.uuid === invoiceUuid)

        if (invoice && invoice.client) {
          this.$store.dispatch('form/payment/SET_FORM_DATA', {
            client_uuid: invoice.client.uuid
          })
        } else {
          this.$store.dispatch('form/payment/SET_FORM_DATA', {
            invoice_uuid: null
          })
        }
      }
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
        this.$store.dispatch('form/payment/SET_FORM_DATA', {
          client_uuid: client.uuid
        })
        this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
      })
    },

    createInvoice() {
      createDocument('invoice', {
        client_uuid: this.form.client_uuid
      }, this.form.client_uuid ? 1 : 0).then((invoice) => {
        this.$store.dispatch('form/payment/SET_FORM_DATA', {
          invoice_uuid: invoice.uuid
        })
        this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 2)
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
    width: 990px;
  }
}
</style>