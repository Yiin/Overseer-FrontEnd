<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select client who made the payment
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="payment">
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
        Select invoice the payment is made for
       -->
      <modal-tab :title="$t('tabs.invoice')">
        <form-container name="payment">
          <form-inline-select-input name="invoice_uuid" :placeholder="$t('placeholders.type_invoice_number')" tabular>
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
              <inline-select-column>{{ invoice.invoice_number }}</inline-select-column>
              <inline-select-column>{{ invoice.client.name }}</inline-select-column>
              <inline-select-column>
                <span class="currency">€</span>
                <span class="currency currency--primary">{{ invoice.amount }}</span>
              </inline-select-column>
              <inline-select-column>
                <span class="currency">€</span>
                <span class="currency currency--secondary">{{ invoice.paid_in }}</span>
              </inline-select-column>
              <inline-select-column class="inline-select-column--center">
                <span class="status" :class="[ 'status--' + $options.filters.invoiceStatus(invoice) ]">
                  {{ invoice | invoiceStatus }}
                </span>
              </inline-select-column>
            </inline-select-row>
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
                <form-text-input v-model="form.amount" name="amount"></form-text-input>

                <!--
                  Currency
                -->
                <form-dropdown-input :watch="passive.currencies" name="currency_id" class="dropdown--small" :placeholder="$t('labels.currency')" scrollable searchable>
                  <dropdown-option v-for="currency in passive.currencies" :key="currency.id"
                                  :value="currency.id"
                                  :selected.once="currency.id === form.currency_id">
                    {{ currency.code }}
                  </dropdown-option>
                </form-dropdown-input>
              </form-inputs-group>
            </form-field>
            <form-field :label="$t('labels.payment_type')">
              <form-dropdown-input :watch="passive.paymentTypes" name="payment_type_id" :placeholder="$t('labels.payment_type')" scrollable searchable>
                <dropdown-option v-for="type in passive.paymentTypes"
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
              <form-date-input v-model="form.payment_date" name="payment_date"></form-date-input>
            </form-field>

            <!--
              Payment Reference
            -->
            <form-field catch-errors="payment_reference" :label="$t('labels.payment_reference')">
              <form-text-input v-model="form.payment_reference" name="payment_reference"></form-text-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>

    </modal-tabs>
  </div>
</template>

<script>
export default {
  name: 'edit-payment',

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

    passive() {
      return this.$store.state.passive
    },

    clients() {
      return this.$store.state.table.clients.items
    },

    invoices() {
      return this.$store.state.table.invoices.items
    }
  },

  methods: {
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