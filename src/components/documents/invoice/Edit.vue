<template>
  <div class="modal-form">
    <modal-tabs @save="save" @fill="fill" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select client we're sending invoice to
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container>
          <form-inline-select-input
            v-if="dropdownOptions.clients.length"
            v-model="client_uuid"
            :items="dropdownOptions.clients"
            :last-item-value="newClientUuid"
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
        Invoice details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container>
          <form-row>
            <form-field :errors="validationErrors.invoice_date" :label="$t('labels.invoice_date')">
              <form-date-input :current-date="!form.fields.uuid" v-model="invoice_date" name="invoice_date" :readonly="preview"></form-date-input>
            </form-field>
            <form-field :errors="validationErrors.invoice_number" :label="$t('labels.invoice_number')">
              <form-text-input v-model="invoice_number" name="invoice_number" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :errors="validationErrors.due_date" :label="$t('labels.invoice_due_date')">
              <form-date-input v-model="due_date" name="due_date" :readonly="preview"></form-date-input>
            </form-field>
            <form-field :errors="validationErrors.po_number" :label="$t('labels.po_number')">
              <form-text-input v-model="po_number" name="po_number" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <!--
              Partial Deposit
            -->
            <form-field :errors="validationErrors.partial" :label="$t('labels.partial')">
              <form-inputs-group>
                <form-formatted-input
                  type="number"
                  :label="currency.code"
                  v-model="partial"
                  name="partial"
                  :readonly="preview"
                ></form-formatted-input>

                <!--
                  Currency
                -->
                <form-currency-dropdown :errors="validationErrors.currency_code" v-model="currency_code" class="half-in-group" :readonly="preview"></form-currency-dropdown>
              </form-inputs-group>
            </form-field>


            <!--
              Discount
            -->
            <form-field :label="$t('labels.discount')">
              <form-inputs-group>
                <!--
                  Discount value
                -->
                <form-formatted-input
                  type="number"
                  :label="discount_type === 'percentage' ? '%' : currency.code"
                  :label-position="discount_type === 'percentage' ? 'right' : 'left'"
                  v-model="discount_value"
                  name="discount_value"
                  :readonly="preview"
                ></form-formatted-input>

                <!--
                  Discount Type
                -->
                <form-dropdown-input
                  v-model="discount_type"
                  :items="dropdownOptions.discountTypes"
                  class="dropdown--small"
                ></form-dropdown-input>
              </form-inputs-group>
            </form-field>
          </form-row>

          <form-row>
            <form-field :label="$t('labels.apply_credit')">
              <v-menu
                top
                full-width
                min-width="430px"
                max-width="430px"
                v-model="creditsMenu"
                :close-on-content-click="false"
              >
                <div
                  slot="activator"
                  class="form__input--label-left"
                  :data-label="currency.code"
                >
                  <div class="form__input">
                    {{ appliedCreditsSum.format() }}
                  </div>
                </div>
                <v-card>
                  <v-list>
                    <v-list-tile avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ client && client.name }}</v-list-tile-title>
                        <v-list-tile-sub-title>Available Credits</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn icon @click="createCredit()">
                          <v-icon>add</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                  <v-divider></v-divider>
                  <v-list class="creditsList" :class="{ 'scrollable': availableCredits.length > 5 }">
                    <v-list-tile v-if="!availableCredits.length">
                      <v-list-tile-action>
                        <v-btn icon @click="createCredit()">
                          <v-icon>add</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          Selected client has no available credit.
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          Click + to create a new one.
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-for="availableCredit in availableCredits" :key="availableCredit.credit.uuid">
                      <v-list-tile-action>
                        <v-switch v-model="appliedCreditsList" :value="availableCredit.credit.uuid" color="orange"></v-switch>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          <span class="currency">
                            {{ currency | currencySymbol }}
                          </span>
                          <span class="currency" :class="{ 'currency--primary': !availableCredit.isApplied, 'currency--secondary': availableCredit.isApplied }">
                            {{ availableCredit.credit.balance.getIn(currency) + getCreditInitialAppliedAmount(availableCredit.credit) | currency }}
                          </span>
                        </v-list-tile-title>
                        <v-list-tile-sub-title :title="availableCredit.credit.creditNumber">
                          {{ availableCredit.credit.creditNumber }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action :style="{ display: availableCredit.isApplied ? 'flex' : 'none' }" class="creditInput">
                        <v-text-field
                          single-line
                          label="Amount to apply"
                          v-model="availableCredit.amountToApply"
                          @change="checkCreditBoundaries(availableCredit)"
                          :prefix="currency.symbol"
                        ></v-text-field>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          Total applied credit
                        </v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          <span class="currency">
                            {{ appliedCreditsSum.currency | currencySymbol }}
                          </span>
                          <span class="currency currency--secondary">
                            {{ appliedCreditsSum.amount | currency }}
                          </span>
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-menu>
            </form-field>
            <form-field></form-field>
          </form-row>

        </form-container>
      </modal-tab>

      <!--
        Invoice items
      -->
      <modal-tab :title="$t('tabs.items')">
        <form-container>

          <bill-items-list
            v-model="items"
            :currency="currency"
            :add-item-form="addItemForm"
          ></bill-items-list>

        </form-container>
      </modal-tab>

      <!--
        Additional info
      -->
      <modal-tab :title="$t('tabs.additional_info')">
        <tabs>
          <!--
            Upload Documents
          -->
          <tab :title="$t('tabs.documents')">
            <form-documents-input :readonly="preview"></form-documents-input>
          </tab>
          <tab :title="$t('tabs.note_to_client')">
            <form-textarea-input v-model="note_to_client" :placeholder="$t('placeholders.note_to_client')" name="note_to_client" rows="12" :readonly="preview"></form-textarea-input>
          </tab>
          <tab :title="$t('tabs.terms')">
            <form-textarea-input v-model="terms" :placeholder="$t('placeholders.invoice_terms')" name="terms" rows="12" :readonly="preview"></form-textarea-input>
          </tab>
          <tab :title="$t('tabs.footer')">
            <form-textarea-input v-model="footer" :placeholder="$t('placeholders.invoice_footer')" name="footer" rows="12" :readonly="preview"></form-textarea-input>
          </tab>
        </tabs>
      </modal-tab>
      <template slot="right-buttons--left">
        <div v-show="modal.activeTabIndex === 0" @click="createClient" class="button button--create">
          <span class="icon-new-client-btn-icon"></span>
          {{ $t('actions.new_client') }}
        </div>
      </template>
      <template slot="right-buttons">
        <dropdown @input="saveInvoice" placeholder="Finish" class="dropdown--primary dropdown--invoice">
          <dropdown-option
            v-if="!form.fields.uuid"
            value="draft"
            :tooltip="{
              content: texts.draft,
              placement: 'right'
            }"
          >
            Save Draft
          </dropdown-option>

          <dropdown-option
            v-if="form.fields.uuid"
            value="save"
          >
            Save Invoice
          </dropdown-option>

          <dropdown-option
            value="email"
            :tooltip="{
              content: texts.email,
              placement: 'right'
            }"
          >
            Email To Client
          </dropdown-option>

          <dropdown-option
            value="sent"
            :tooltip="{
              content: texts.sent,
              placement: 'right'
            }"
          >
            Mark Sent
          </dropdown-option>
        </dropdown>
      </template>
    </modal-tabs>
    <div class="modal-sidebar">
      <bill-summary form="invoice"></bill-summary>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import FormMixin from '@/mixins/FormMixin'
import BillableDocumentMixin from '@/mixins/BillableDocumentMixin'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'
import BillSummary from '@/components/form/BillSummary.vue'
import { createDocument } from '@/modules/documents/actions'
import Money from '@/modules/documents/models/money'

export default {
  mixins: [
    BillableDocumentMixin,
    FormMixin('invoice', [
      'client_uuid',
      'invoice_date',
      'partial',
      'currency_code',
      'invoice_number',
      'po_number',
      'discount_type',
      'discount_value',
      'items',
      'applied_credits',
      'documents',
      'note_to_client',
      'terms',
      'footer'
    ])
  ],

  components: {
    FormCurrencyDropdown,
    FormFormattedInput,
    BillSummary
  },

  data() {
    return {
      creditsMenu: false,
      appliedCreditsList: [], // list of uuids
      appliedCredits: [],
      initialAppliedCredits: [],
      addItemForm: false
    }
  },

  computed: {
    texts() {
      return {
        draft: 'Invoice will be saved as a <span class="highlight">draft</span>.',
        email: 'Invoice will be <span class="highlight">saved</span> and <span class="highlight">emailed</span> to the client.',
        sent: 'Invoice will be saved as <span class="highlight">sent</span>, however the client will not be notified'
      }
    },

    newClientUuid() {
      return this.form.newClientUuid
    },

    clientCredits() {
      if (this.client_uuid) {
        return this.dropdownOptions.credits.filter((credit) => {
          return credit.client.uuid === this.client_uuid && credit.balance.amount + this.getCreditInitialAppliedAmount(credit) > 0
        })
      } else {
        return []
      }
    },

    availableCredits() {
      return this.clientCredits.map((credit) => {
        const appliedCredit = this.appliedCredits.find((appliedCredit) => appliedCredit.credit.uuid === credit.uuid)

        return appliedCredit || {
          credit,
          isApplied: false
        }
      })
    },

    appliedCreditsSum() {
      return Money.create({
        amount: this.appliedCredits.reduce((sum, credit) => {
          return sum + parseFloat(credit.amountToApply)
        }, 0),
        currency: this.currency
      })
    },

    client() {
      return this.clients.find((client) => client.uuid === this.client_uuid)
    },

    due_date: {
      get() {
        // if document is already created, leave due date as it is
        if (this.form.fields.uuid) {
          return this.form.fields.due_date
        }

        // else set due date by client's payment terms
        const client = this.clients.find((client) => client.uuid === this.client_uuid)

        if (client) {
          if (client.paymentTerms !== null) {
            return moment(this.invoice_date).add(client.paymentTerms, 'days')
          }
        }
        return null
      },

      set(value) {
        this.$store.commit(`form/invoice/SET_FIELD_VALUE`, {
          field: 'due_date',
          value
        })
      }
    },

    passive() {
      return this.$store.state.passive
    }
  },

  watch: {
    appliedCreditsList(appliedCreditsList) {
      const newAppliedCredits = appliedCreditsList.filter((uuid) => !this.appliedCredits.find((appliedCredit) => appliedCredit.credit.uuid === uuid))

      newAppliedCredits.forEach((uuid) => {
        const credit = this.credits.find((credit) => credit.uuid === uuid)

        this.appliedCredits.push({
          isApplied: true,
          credit,
          amountToApply: credit.balance.getIn(this.currency)
        })
      })

      this.appliedCredits = this.appliedCredits.filter((appliedCredit) => appliedCreditsList.find((uuid) => uuid === appliedCredit.credit.uuid))
    },

    appliedCredits: {
      handler: function (appliedCredits) {
        this.applied_credits = appliedCredits.map((appliedCredit) => {
          return {
            credit_uuid: appliedCredit.credit.uuid,
            amount: Number(appliedCredit.amountToApply),
            currency_code: this.currency.code
          }
        })
      },
      deep: true
    }
  },

  mounted() {
    this.initialAppliedCredits = JSON.parse(JSON.stringify(this.applied_credits))

    this.appliedCredits = this.applied_credits.map((appliedCredit) => {
      const credit = this.credits.find((credit) => credit.uuid === appliedCredit.credit_uuid)

      const amount = Money.create({
        amount: appliedCredit.amount,
        currency: appliedCredit.currency_code
      }).getIn(this.currency)

      return {
        isApplied: true,
        credit,
        amountToApply: amount
      }
    })
    this.appliedCreditsList = this.appliedCredits.map((appliedCredit) => appliedCredit.credit.uuid)
  },

  methods: {
    addItem() {

    },

    getCreditInitialAppliedAmount(credit) {
      const initial = this.initialAppliedCredits.find((initialAppliedCredit) => initialAppliedCredit.credit_uuid === credit.uuid)

      if (initial) {
        return Money.create({
          amount: initial.amount,
          currency: this.currency_code
        }).getIn(this.currency)
      } else {
        return 0
      }
    },

    checkCreditBoundaries(appliedCredit) {
      const currentCreditBalance = appliedCredit.credit.balance.getIn(this.currency) + this.getCreditInitialAppliedAmount(appliedCredit.credit)

      if (parseFloat(appliedCredit.amountToApply) > currentCreditBalance) {
        appliedCredit.amountToApply = currentCreditBalance
      } else if (parseFloat(appliedCredit.amountToApply) < 0) {
        appliedCredit.amountToApply = 0
      }
    },

    createCredit() {
      createDocument('credit', {
        client_uuid: this.client.uuid
      }, {
        tabIndex: 1
      }).then(() => {
        setTimeout(() => {
          this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
        }, 100)
      })
    },

    createClient() {
      createDocument('client').then((client) => {
        this.$store.dispatch('form/invoice/SET_FORM_DATA', {
          client_uuid: client.uuid
        })
        this.$store.commit('form/invoice/SET_NEW_CLIENT', client.uuid)
        this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 0)
      })
    },

    saveInvoice(action) {
      switch (action) {
      case 'draft':
        this.$store.dispatch('form/invoice/SET_FORM_DATA', {
          status: 'draft'
        })
        break
      case 'sent':
        this.$store.dispatch('form/invoice/SET_FORM_DATA', {
          status: 'sent'
        })
        break
      case 'email':
        this.$store.dispatch('form/invoice/SET_FORM_DATA', {
          status: 'pending'
        })
      }
      this.save()
    }
  }
}
</script>

<style lang="scss">
.addItemMenu {
  width: 400px;
}

.tooltip {
  .highlight {
    color: $color-main;
    font-weight: 600;
  }
}
</style>

<style lang="scss" scoped>
iframe {
    overflow:hidden;
}

.modal-form {
  display: flex;
  height: 617px;

  .modal-tabs {
    width: 990px;
  }
}

.modal-sidebar {
  width: 473px;
  float: right;
  margin-top: 54px;
  padding-top: 24px;
  background: white;
  border-left: 4px solid #f5f5f5;
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

.button__modal--save-draft {
  background: #808080;
}

.creditInput {
    min-width: 160px;
    width: 160px;
    margin-left: 35px;

    > .input-group {
        padding: 0;
        > label {
          top: 0;
        }
    }
}

.creditsList {
  max-height: 288px;
  overflow: auto;
  margin-right: 7px;
  margin-bottom: 2px;
}

// .button__modal--mark-sent {
//   background:
// }

// .button__modal--email-invoice {
//   background:
// }

</style>