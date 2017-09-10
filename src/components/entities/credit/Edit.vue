<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="credit">
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
        Credit details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container name="credit">
          <form-row>
            <form-field :label="$t('labels.amount')">
              <form-inputs-group>

                <!--
                  Amount
                -->
                <form-text-input name="amount"></form-text-input>

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
          </form-row>
          <form-row>

            <!--
              Credit Date
            -->
            <form-field catch-errors="credit_date" :label="$t('labels.credit_date')">
              <form-date-input name="credit_date"></form-date-input>
            </form-field>

            <!--
              Credit Due Date
            -->
            <form-field catch-errors="credit_due_date" :label="$t('labels.credit_due_date')">
              <form-date-input name="credit_due_date"></form-date-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>

    </modal-tabs>
  </div>
</template>

<script>
export default {
  name: 'edit-credit',

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

      currencies: [
        { id: 1, code: 'GEA' },
        { id: 2, code: 'HFB' },
        { id: 3, code: 'IGC' },
        { id: 4, code: 'JHD' },
        { id: 5, code: 'KIE' }
      ]
    }
  },

  computed: {
    form() {
      return this.$store.state.form.credit
    }
  },

  watch: {
    name: function (val) {
      this.data.credit.name = val
    },
    price: function (val) {
      this.data.credit.price = val
    },
    qty: function (val) {
      this.data.credit.qty = val
    },
    currency: function (val) {
      this.data.credit.currency = val
    },
    taxRate: function (val) {
      this.data.credit.taxRate = val
    },
    description: function (val) {
      this.data.credit.description = val
    }
  },

  methods: {
    save() {
      if (this.data.credit.key) {
        this.$store.dispatch('SAVE_ENTITY', {
          tableName: 'credits',
          data: this.data
        })
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('CREATE_ENTITY', {
        tableName: 'credits',
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