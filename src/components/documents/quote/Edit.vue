<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select client we're sending quote to
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
        quote details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container>
          <form-row>
            <form-field :label="$t('labels.quote_date')">
              <form-date-input current-date v-model="quote_date" name="quote_date" :readonly="preview"></form-date-input>
            </form-field>
            <form-field :label="$t('labels.quote_number')">
              <form-text-input v-model="quote_number" name="quote_number" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.due_date')">
              <form-date-input v-model="due_date" name="due_date" :readonly="preview"></form-date-input>
            </form-field>
            <form-field :label="$t('labels.po_number')">
              <form-text-input v-model="po_number" name="po_number" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <!--
              Partial Deposit
            -->
            <form-field catch-errors="partial" :label="$t('labels.partial')">
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
                <form-currency-dropdown v-model="currency_code" class="half-in-group" :readonly="preview"></form-currency-dropdown>
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
                  :label="discount_type === 'percentage' ? '%' : currencyCode"
                  :label-position="discount_type === 'percentage' ? 'right' : 'left'"
                  v-model="discount_value"
                  name="discount_value"
                  :readonly="preview"
                ></form-formatted-input>

                <!--
                  Discount Type
                -->
                <form-dropdown-input v-model="discount_type" name="discount_type" class="dropdown--small" :readonly="preview">
                  <dropdown-option
                    value="percentage"
                    :selected="discount_type === 'percentage'"
                  >
                    {{ $t('discount_type.percent') }}
                  </dropdown-option>
                  <dropdown-option
                    value="flat"
                    :selected="discount_type === 'flat'"
                  >
                    {{ $t('discount_type.flat') }}
                  </dropdown-option>
                </form-dropdown-input>
              </form-inputs-group>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>

      <!--
        quote items
      -->
      <modal-tab :title="$t('tabs.items')">
        <form-container>

          <form-items-list ref="itemsList" v-model="items" :model="itemModel" name="items" :readonly="preview">

            <!--
              New item form
            -->
            <template slot="fields" slot-scope="props">

              <!--
                Product
              -->
              <form-field class="field--product" :label="$t('labels.item')">
                <form-dropdown-input
                  @input="itemsListProductChange"
                  v-model="props.form.product"
                  document new-entry-value="name"
                  :watch="products"
                  :placeholder="$t('placeholders.please_select_a_product')"
                  searchable scrollable
                >
                  <dropdown-option v-for="(product, index) in products" :key="index" :value="product">
                    {{ product.name }}
                  </dropdown-option>
                </form-dropdown-input>
              </form-field>

              <!--
                Unit Cost
              -->
              <form-field class="field--cost" :label="$t('labels.unit_cost')">
                <form-text-input v-model="props.cost" name="cost" :readonly="preview"></form-text-input>
              </form-field>

              <!--
                Quantity
              -->
              <form-field class="field--qty" :label="$t('labels.qty')">
                <form-text-input v-model="props.qty" name="qty" :readonly="preview"></form-text-input>
              </form-field>

              <!--
                Discount
              -->
              <form-field class="field--discount" :label="$t('labels.discount')">
                <form-text-input v-model="props.discount" name="discount" :readonly="preview"></form-text-input>
              </form-field>

              <!--
                Tax Rate
              -->
              <form-field class="field--tax-rate" :label="$t('labels.tax_rate')">
                <form-dropdown-input v-model="props.tax_rate" document searchable scrollable :readonly="preview">
                  <dropdown-option v-for="(tr, index) in taxRates" :key="index" :value="tr">
                    {{ tr.name }}
                  </dropdown-option>
                </form-dropdown-input>
              </form-field>
            </template>

            <!--
              List item
            -->
            <template slot="preview" slot-scope="row">
              <div class="list-item__field field--product">
                <div class="list-item__field list-item__index">
                  {{ row.index + 1 }}.
                </div>
                {{ row.item.product.name }}
              </div>
              <div class="list-item__field field--cost">
                <span class="currency">
                    {{ currency.symbol | currencySymbol }}
                </span>
                <span class="currency currency--primary">
                    {{ row.item.cost | currency }}
                </span>
              </div>
              <div class="list-item__field field--qty">
                {{ row.item.qty }}
              </div>
              <div class="list-item__field field--discount">
                <span class="currency currency--primary">
                    {{ row.item.discount | currency }}
                </span>
                <span class="currency">
                    %
                </span>
              </div>
              <div class="list-item__field field--tax-rate">
                {{ row.item.taxRate ? row.item.taxRate.text : '' }}
              </div>
            </template>

            <template slot="summary">
              <div class="summary-block">
                <label class="summary-block__title">
                    {{ $t('labels.subtotal') }}
                </label>
                <span class="currency">
                    {{ currency.symbol | currencySymbol }}
                </span>
                <span class="currency currency--primary">
                    {{ subtotal | currency }}
                </span>
              </div>

              <div class="summary-block">
                <label class="summary-block__title">
                    {{ $t('labels.discount') }}
                </label>
                <span class="currency">
                    {{ currency.symbol | currencySymbol }}
                </span>
                <span class="currency currency--primary">
                    {{ discount | currency }}
                </span>
              </div>

              <div class="summary-block">
                <label class="summary-block__title">
                    {{ $t('labels.taxes') }}
                </label>
                <span class="currency">
                    {{ currency.symbol | currencySymbol }}
                </span>
                <span class="currency currency--primary">
                    {{ taxes | currency }}
                </span>
              </div>

              <div class="summary-block">
                <label class="summary-block__title">
                  {{ $t('labels.paid_to_date') }}
                </label>
                <span class="currency">
                  {{ currency.symbol | currencySymbol }}
                </span>
                <span class="currency currency--primary">
                  {{ paid_to_date | currency }}
                </span>
              </div>

              <div class="summary-block">
                <label class="summary-block__title">
                  {{ $t('labels.balance_due') }}
                </label>
                <span class="currency">
                  {{ currency.symbol | currencySymbol }}
                </span>
                <span class="currency currency--primary">
                  {{ balance_due | currency }}
                </span>
              </div>
            </template>
          </form-items-list>

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
            <form-container>
              <form-textarea-input v-model="note_to_client" :placeholder="$t('placeholders.note_to_client')" name="note_to_client" rows="12" :readonly="preview"></form-textarea-input>
            </form-container>
          </tab>
          <tab :title="$t('tabs.terms')">
            <form-container>
              <form-textarea-input v-model="terms" :placeholder="$t('placeholders.invoice_terms')" name="terms" rows="12" :readonly="preview"></form-textarea-input>
            </form-container>
          </tab>
          <tab :title="$t('tabs.footer')">
            <form-container>
              <form-textarea-input v-model="footer" :placeholder="$t('placeholders.invoice_footer')" name="footer" rows="12" :readonly="preview"></form-textarea-input>
            </form-container>
          </tab>
        </tabs>
      </modal-tab>

      <template slot="right-buttons">
        <dropdown @input="saveQuote" placeholder="Finish" class="dropdown--primary dropdown--invoice">
          <dropdown-option v-if="!form.fields.uuid" value="draft" :tooltip="{ content: 'Save Draft', placement: 'right' }">
            Save Draft
          </dropdown-option>
          <dropdown-option v-if="form.fields.uuid" value="save" :tooltip="{ content: 'Save Invoice', placement: 'right' }">
            Save Quote
          </dropdown-option>
          <dropdown-option value="email" :tooltip="{ content: 'Email To Client', placement: 'right' }">
            Email To Client
          </dropdown-option>
          <dropdown-option value="sent" :tooltip="{ content: 'Mark Sent', placement: 'right' }">
            Mark Sent
          </dropdown-option>
        </dropdown>
      </template>
    </modal-tabs>
    <div class="modal-sidebar">
      <div class="modal-sidebar__title">
        {{ $t('sidebar.quote_preview') }}
      </div>
      <div class="invoice__preview"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import FormMixin from '@/mixins/FormMixin'
import CurrencyMixin from '@/mixins/CurrencyMixin'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput'
import { createDocument } from '@/modules/documents/actions'

export default {
  mixins: [
    CurrencyMixin,
    FormMixin('quote', [
      'client_uuid',
      'quote_date',
      'partial',
      'currency_code',
      'quote_number',
      'po_number',
      'discount_type',
      'discount_value',
      'items',
      'documents',
      'note_to_client',
      'terms',
      'footer'
    ])
  ],

  components: {
    FormCurrencyDropdown,
    FormFormattedInput
  },

  data() {
    return {
      itemModel: {
        product: {},
        product_name: '',
        qty: 1,
        cost: 0,
        discount: 0,
        tax_rate: null
      }
    }
  },

  computed: {
    due_date: {
      get() {
        // if document is already created, leave due date as it is
        if (this.form.fields.uuid) {
          return this.form.fields.due_date
        }

        // else set due date by client's payment terms
        const client = this.clients.find((client) => client.uuid === this.client_uuid)

        if (client) {
          if (client.payment_terms !== null) {
            return moment(this.invoice_date).add(client.payment_terms, 'days')
          }
        }
        return null
      },

      set(value) {
        this.$store.commit(`form/quote/SET_FIELD_VALUE`, {
          field: 'due_date',
          value
        })
      }
    },

    subtotal() {
      return this.form.fields.items.filter((item) => item.cost)
        .map((item) => {
          return parseFloat(item.cost) * parseFloat(item.qty || 1)
        })
        .reduce((a, b) => a + b, 0)
    },

    discount() {
      return this.form.fields.items
        .map((item) => {
          const priceSum = parseFloat(item.cost) * parseFloat(item.qty || 1)
          return priceSum * (parseFloat(item.discount) || 0) / 100
        })
        .reduce((a, b) => a + b, 0)
    },

    taxes() {
      const items = this.form.fields.items
      let taxes = 0 // flat

      for (let i = 0; i < items.length; ++i) {
        if (!items[i].tax_rate) {
          continue
        }

        const tax = this.taxRates.find((taxRate) => taxRate.uuid === items[i].tax_rate.uuid)

        if (!tax) {
          continue
        }

        taxes += parseFloat(tax.rate) * parseFloat(items[i].cost) * (parseFloat(items[i].discount) / 100) / 100
      }
      return taxes
    },

    paid_to_date() {
      if (this.form.fields.uuid) {
        return parseFloat(this.form.paid_in)
      }
      return parseFloat(this.form.partial)
    },

    balance_due() {
      return this.subtotal - this.discount + this.taxes - this.paid_to_date
    },

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
    },

    products() {
      return this.$store.state.table.products.items
    },

    taxRates() {
      return this.$store.state.table.tax_rates.items
    }
  },

  methods: {
    itemsListProductChange(product) {
      if (!product) {
        return
      }
      this.$refs.itemsList.setItemAttribute('cost', product.price)
    },

    createClient() {
      createDocument('client').then((client) => {
        this.$store.dispatch('form/quote/SET_FORM_DATA', {
          client_uuid: client.uuid
        })
        this.$store.dispatch('modal/UPDATE_ACTIVE_TAB_INDEX', 1)
      })
    },

    saveQuote(action) {
      switch (action) {
      case 'draft':
        this.$store.dispatch('form/quote/SET_FORM_DATA', {
          status: 'draft'
        })
        break
      case 'sent':
        this.$store.dispatch('form/quote/SET_FORM_DATA', {
          status: 'sent'
        })
        break
      case 'email':
        this.$store.dispatch('form/quote/SET_FORM_DATA', {
          status: 'pending'
        })
      }
      this.save()
    }
  }
}
</script>

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
</style>