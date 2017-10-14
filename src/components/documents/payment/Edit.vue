<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select client who made the payment
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="payment">
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
              <button @click="createClient" class="button button--create">
                <span class="icon-new-client-btn-icon"></span>
                {{ $t('actions.new_client') }}
              </button>
            </div>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <!--
        Select invoice the payment is made for
       -->
      <modal-tab :title="$t('tabs.invoice')">
        <form-container name="payment">
          <form-inline-select-input :watch="invoices" name="invoice_uuid" :placeholder="$t('placeholders.type_invoice_number')" tabular :readonly="preview">
            <template slot="head">
              <inline-select-column width="25%">{{ $t('fields.invoice_number') }}</inline-select-column>
              <inline-select-column width="24%">{{ $t('fields.client_name') }}</inline-select-column>
              <inline-select-column width="18%">{{ $t('fields.total_amount') }}</inline-select-column>
              <inline-select-column width="18%">{{ $t('fields.paid_in') }}</inline-select-column>
              <inline-select-column width="15%" class="inline-select-column--center">{{ $t('fields.status') }}</inline-select-column>
            </template>

            <inline-select-row slot="rows" v-for="invoice in invoices" :key="invoice.uuid"
                              :value="invoice.uuid"
                              :searchable="invoice.invoice_number"
                              :selected.once="invoice.uuid === form.invoice_uuid"
            >
              <inline-select-column width="25%">{{ invoice.invoice_number }}</inline-select-column>
              <inline-select-column width="24%">{{ invoice.client.name }}</inline-select-column>
              <inline-select-column width="18%">
                <span class="currency">€</span>
                <span class="currency currency--primary">{{ invoice.amount }}</span>
              </inline-select-column>
              <inline-select-column width="18%">
                <span class="currency">€</span>
                <span class="currency currency--secondary">{{ invoice.paid_in }}</span>
              </inline-select-column width="15%">
              <inline-select-column class="inline-select-column--center">
                <span class="status" :class="[ 'status--' + $options.filters.invoiceStatus(invoice) ]">
                  {{ invoice | invoiceStatus }}
                </span>
              </inline-select-column>
            </inline-select-row>

            <div slot="placeholder" class="placeholder-area">
              <div class="placeholder placeholder--invoices"></div>
              <div class="placeholder placeholder--line"></div>
              <div class="placeholder__text">
                Add a new invoice by pressing the button below.
              </div>
              <button @click="createInvoice" class="button button--create">
                <span class="icon-new-invoice-btn-icon"></span>
                {{ $t('actions.new_invoice') }}
              </button>
            </div>
          </form-inline-select-input>
        </form-container>
      </modal-tab>

      <!--
        Invoice details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container name="payment">
          <form-row>
            <form-field :catch-errors="[ 'amount', 'currency' ]" :label="$t('labels.amount')">
              <form-inputs-group>

                <!--
                  Price
                -->
                <form-text-input v-model="form.amount" name="amount" :readonly="preview"></form-text-input>

                <!--
                  Currency
                -->
                <form-currency-dropdown v-model="form.currency_code" class="dropdown--small" :readonly="preview"></form-currency-dropdown>
              </form-inputs-group>
            </form-field>
            <form-field :label="$t('labels.payment_type')">
              <form-dropdown-input :watch="passive.paymentTypes" name="payment_type_id" :placeholder="$t('labels.payment_type')" scrollable searchable :readonly="preview">
                <dropdown-option v-for="type in paymentTypes"
                                :key="type.name"
                                :value="type.id"
                                :selected.once="type.id === form.method_id"
                >
                  {{ type.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>

            <!--
              Payment Date
            -->
            <form-field catch-errors="payment_date" :label="$t('labels.payment_date')">
              <form-date-input current-date v-model="form.payment_date" name="payment_date" :readonly="preview"></form-date-input>
            </form-field>

            <!--
              Payment Reference
            -->
            <form-field catch-errors="payment_reference" :label="$t('labels.payment_reference')">
              <form-text-input v-model="form.payment_reference" name="payment_reference" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>

    </modal-tabs>
  </div>
</template>

<script>
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import { createDocument } from '@/modules/documents/actions'

export default {
  name: 'edit-payment',

  components: {
    FormCurrencyDropdown
  },

  props: {
    data: {
      default: () => {
        return {}
      }
    }
  },

  computed: {
    form() {
      return this.$store.state.form.payment
    },

    preview() {
      return this.form.__preview
    },

    passive() {
      return this.$store.state.passive
    },

    credits() {
      return this.$store.getters['table/credits/activeItems']
    },

    paymentTypes() {
      return this.passive.paymentTypes
    },

    clients() {
      return this.$store.state.table.clients.items
    },

    invoices() {
      if (this.form.client_uuid) {
        return this.$store.state.table.invoices.items.filter((invoice) => {
          return invoice.client && invoice.client.uuid === this.form.client_uuid
        })
      }
      return this.$store.state.table.invoices.items
    }
  },

  watch: {
    'form.client_uuid': function (clientUuid) {
      if (clientUuid) {
        if (!this.invoices.find((invoice) => invoice.uuid === this.form.invoice_uuid)) {
          this.$store.dispatch('form/payment/SET_FORM_DATA', {
            invoice_uuid: null
          })
        }
      }
    },

    'form.invoice_uuid': function (invoiceUuid) {
      if (invoiceUuid && !this.form.client_uuid) {
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

  methods: {
    createClient() {
      createDocument('client').then((client) => {
        this.$store.dispatch('form/payment/SET_FORM_DATA', {
          client_uuid: client.uuid
        })
        this.$store.dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', 1)
      })
    },

    createInvoice() {
      createDocument('invoice', {
        client_uuid: this.form.client_uuid
      }, this.form.client_uuid ? 1 : 0).then((invoice) => {
        this.$store.dispatch('form/payment/SET_FORM_DATA', {
          invoice_uuid: invoice.uuid
        })
        this.$store.dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', 2)
      })
    },

    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/payment/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('form/payment/CREATE')
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