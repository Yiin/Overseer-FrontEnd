<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select client
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="credit">
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
        Credit details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container name="credit">
          <form-row>
            <form-field :label="$t('labels.amount')">
              <!--
                Amount
              -->
              <form-formatted-input
                type="number"
                :label="currencyCode"
                v-model="form.amount"
                name="amount"
                :readonly="preview"
              ></form-formatted-input>
            </form-field>

            <!--
              Currency
            -->
            <form-currency-dropdown v-model="form.currency_id" :readonly="preview"></form-currency-dropdown>
          </form-row>
          <form-row>

            <!--
              Credit Date
            -->
            <form-field catch-errors="credit_date" :label="$t('labels.credit_date')">
              <form-date-input current-date v-model="form.credit_date" name="credit_date" :readonly="preview"></form-date-input>
            </form-field>

            <!--
              Credit Number
            -->
            <form-field catch-errors="credit_number" :label="$t('labels.credit_number')">
              <form-text-input v-model="form.credit_number" name="credit_number" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>
        </form-container>
      </modal-tab>

    </modal-tabs>
  </div>
</template>

<script>
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'
import { createDocument } from '@/modules/documents/actions'

export default {
  name: 'edit-credit',

  components: {
    FormCurrencyDropdown,
    FormFormattedInput
  },

  props: {
    data: {
      default: null
    }
  },

  computed: {
    form() {
      return this.$store.state.form.credit
    },

    preview() {
      return this.form.__preview
    },

    passive() {
      return this.$store.state.passive
    },

    currency() {
      let currency = null

      if (this.form.currency_id) {
        currency = this.passive.currencies.find((c) => c.id === this.form.currency_id)
      }
      if (!currency) {
        let client = this.form.client || this.clients.find((c) => c.uuid === this.form.client_uuid)

        if (client) {
          currency = client.currency
        }
      }
      if (!currency) {
        currency = this.$store.state.settings.currency
      }
      return currency
    },

    currencyCode() {
      if (this.currency) {
        return this.currency.code
      }
      return 'EUR'
    },

    clients() {
      return this.$store.state.table.clients.items
    }
  },

  methods: {
    createClient() {
      createDocument('client').then((client) => {
        this.$store.dispatch('SET_FORM_DATA', {
          client_uuid: client.uuid
        })
        this.$store.dispatch('UPDATE_MODAL_ACTIVE_TAB_INDEX', 1)
      })
    },

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
    width: 590px;
  }
}
</style>