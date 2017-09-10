<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select client who made the payment
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="payment">
          <form-inline-select-input name="client" :placeholder="$t('placeholders.type_client_name')">
            <inline-option v-for="client in clients"
                          :key="client.uuid"
                          :value="client.uuid"
                          :selected.once="client.uuid === form.client"
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
          <form-inline-select-input name="invoice" :placeholder="$t('placeholders.type_invoice_number')" tabular>
            <template slot="head">
              <inline-select-column width="25%">{{ $t('fields.invoice_number') }}</inline-select-column>
              <inline-select-column width="24%">{{ $t('fields.client_name') }}</inline-select-column>
              <inline-select-column width="18%">{{ $t('fields.total_amount') }}</inline-select-column>
              <inline-select-column width="18%">{{ $t('fields.paid_in') }}</inline-select-column>
              <inline-select-column width="15%" align="center">{{ $t('fields.status') }}</inline-select-column>
            </template>

            <inline-select-row slot="rows" v-for="invoice in invoices" :key="invoice.uuid"
                              :value="invoice.invoice_number"
                              :searchable="invoice.invoice_number"
            >
              <inline-select-column>{{ invoice.invoice_number }}</inline-select-column>
              <inline-select-column>{{ invoice.client_name }}</inline-select-column>
              <inline-select-column>
                <span class="currency">€</span>
                <span class="currency currency--primary">{{ invoice.amount }}</span>
              </inline-select-column>
              <inline-select-column>
                <span class="currency">€</span>
                <span class="currency currency--secondary">{{ invoice.paid_in }}</span>
              </inline-select-column>
              <inline-select-column>{{ invoice.status }}</inline-select-column>
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
            <form-field :catch-errors="[ 'price', 'currency' ]" :label="$t('labels.price')">
              <form-inputs-group>

                <!--
                  Price
                -->
                <form-text-input name="price"></form-text-input>

                <!--
                  Currency
                -->
                <form-dropdown-input name="currency" class="dropdown--small" :placeholder="$t('labels.currency')">
                  <dropdown-option v-for="currency in currencies" :key="currency.id"
                                  :value="currency.id"
                                  :selected.once="currency.id === form.currency">
                    {{ currency.code }}
                  </dropdown-option>
                </form-dropdown-input>
              </form-inputs-group>
            </form-field>
            <form-field :label="$t('labels.payment_type')">
              <form-dropdown-input name="payment_type" :placeholder="$t('label.payment_type')">
                <dropdown-option v-for="type in paymentTypes"
                                :key="type.name"
                                :value="type.name"
                                :selected.once="type.id === form.payment_type"
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
              <form-date-input name="payment_date"></form-date-input>
            </form-field>

            <!--
              Payment Reference
            -->
            <form-field catch-errors="payment_reference" :label="$t('labels.payment_reference')">
              <form-date-input name="payment_reference"></form-date-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>

    </modal-tabs>
  </div>
</template>

<script>
import uuidv4 from 'uuid/v4'
import uuidv5 from 'uuid/v5'

const MY_NAMESPACE = uuidv4()

const getUuid = () => uuidv5(Math.random().toString(), MY_NAMESPACE)

export default {
  name: 'edit-payment',

  props: {
    data: {
      default: () => {
        return {}
      }
    }
  },

  data() {
    // const current = this.data.invoice

    return {
      clients: [
        { uuid: '0001', name: 'Client A' },
        { uuid: '0002', name: 'Client B' },
        { uuid: '0003', name: 'Client C' },
        { uuid: '0004', name: 'Client D' },
        { uuid: '0005', name: 'Client E' }
      ],

      invoices: [
        { uuid: getUuid(), invoice_number: 'IV-10420', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10419', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10418', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10417', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10416', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10415', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10414', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10413', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10412', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' },
        { uuid: getUuid(), invoice_number: 'IV-10411', client_name: 'UAB "AKA Juventus Panevėžys"', amount: '8,321,456.00', paid_in: '5,000,000.00', status: 'Sent' }
      ],

      currencies: [
        { id: 1, code: 'GEA' },
        { id: 2, code: 'HFB' },
        { id: 3, code: 'IGC' },
        { id: 4, code: 'JHD' },
        { id: 5, code: 'KIE' }
      ],

      paymentTypes: [
        { id: 1, name: 'American Express' },
        { id: 2, name: 'Cash' },
        { id: 3, name: 'Check' },
        { id: 4, name: 'PayPal' }
      ]
    }
  },

  computed: {
    form() {
      return this.$store.state.form.expense
    }
  },

  watch: {
    name: function (val) {
      this.data.payment.name = val
    },
    price: function (val) {
      this.data.payment.price = val
    },
    qty: function (val) {
      this.data.payment.qty = val
    },
    currency: function (val) {
      this.data.payment.currency = val
    },
    taxRate: function (val) {
      this.data.payment.taxRate = val
    },
    description: function (val) {
      this.data.payment.description = val
    }
  },

  methods: {
    save() {
      if (this.data.payment.key) {
        this.$store.dispatch('SAVE_ENTITY', {
          tableName: 'payments',
          data: this.data
        })
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('CREATE_ENTITY', {
        tableName: 'payments',
        data: this.data
      })
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
.modal-sidebar {
  width: 397px;
  border-left: 1px solid #e1e1e1;
  float: right;
}

.field--product {
  width: 30%;

  .list-item__field & {
    min-width: 39%;
  }
}

.field--cost {
  width: 15%;
}

.field--qty {
  width: 10%;
}

.field--discount {
  width: 10%;
}

.field--tax-rate {
  width: 20%;
}

.field--actions {
  min-width: 15%;

  &.list-item__field {
    min-width: 10%;
  }
}
</style>