<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="credit">
          <form-inline-select-input :watch="clients" name="client_uuid" :placeholder="$t('placeholders.type_client_name')">
            <inline-option v-for="client in clients"
                          :key="client.uuid"
                          :value="client.uuid"
                          :selected.once="client.uuid === form.client_uuid"
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
                <form-text-input v-model="form.amount" name="amount"></form-text-input>

                <!--
                  Currency
                -->
                <form-dropdown-input v-model="form.currency_id" :watch="passive.currencies" name="currency" class="dropdown--small" :placeholder="$t('labels.currency')" scrollable searchable>
                  <dropdown-option v-for="currency in passive.currencies" :key="currency.id"
                                  :value="currency.id"
                                  :selected.once="currency.id === form.currency_id">
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
              Credit Number
            -->
            <form-field catch-errors="credit_number" :label="$t('labels.credit_number')">
              <form-date-input name="credit_number"></form-date-input>
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
      default: null
    }
  },

  computed: {
    form() {
      return this.$store.state.form.credit
    },

    passive() {
      return this.$store.state.passive
    },

    clients() {
      return this.$store.state.table.clients.items
    }
  },

  methods: {
    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/credit/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('form/credit/CREATE')
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