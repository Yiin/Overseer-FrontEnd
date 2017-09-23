<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select client we're sending invoice to
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="invoice">
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
        Invoice details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container name="invoice">
          <form-row>
            <form-field catch-errors="invoice_date" :label="$t('labels.invoice_date')">
              <form-date-input v-model="form.invoice_date" name="invoice_date"></form-date-input>
            </form-field>
            <form-field catch-errors="invoice_number" :label="$t('labels.invoice_number')">
              <form-text-input v-model="form.invoice_number" name="invoice_number"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field catch-errors="due_date" :label="$t('labels.invoice_due_date')">
              <form-date-input v-model="form.due_date" name="due_date"></form-date-input>
            </form-field>
            <form-field catch-errors="po_number" :label="$t('labels.po_number')">
              <form-text-input v-model="form.po_number" name="po_number"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.partial')">
              <form-date-input v-model="form.partial" name="partial"></form-date-input>
            </form-field>
            <form-field :label="$t('labels.discount')">
              <form-inputs-group>
                <form-text-input v-model="form.discount_value" name="discount_value"></form-text-input>
                <form-dropdown-input v-model="form.discount_type" name="discount_type" class="dropdown--small">
                  <dropdown-option value="percentage" :selected="form.discount_type === 'percentage'">{{ $t('discount_type.percent') }}</dropdown-option>
                  <dropdown-option value="flat" :selected="form.discount_type === 'flat'">{{ $t('discount_type.flat') }}</dropdown-option>
                </form-dropdown-input>
              </form-inputs-group>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>

      <!--
        Invoice items
      -->
      <modal-tab :title="$t('tabs.items')">
        <form-container name="invoice">

          <form-items-list ref="itemsList"
                           v-model="form.items"
                           :model="itemModel"
                           name="$items"
          >

            <!--
              New item form
            -->
            <template slot="fields" scope="props">

              <!--
                Product
              -->
              <form-field class="field--product" :label="$t('labels.item')">
                <form-dropdown-input
                  @input="itemsListProductChange"
                  v-model="props.form.product"
                  document new-entry-value="name"
                  :watch="products"
                  :placeholder="$t('placeholders.please_select_a_product')"  searchable scrollable
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
                <form-text-input v-model="props.form.cost" name="cost"></form-text-input>
              </form-field>

              <!--
                Quantity
              -->
              <form-field class="field--qty" :label="$t('labels.qty')">
                <form-text-input v-model="props.form.qty" name="qty"></form-text-input>
              </form-field>

              <!--
                Discount
              -->
              <form-field class="field--discount" :label="$t('labels.discount')">
                <form-text-input v-model="props.form.discount" name="discount"></form-text-input>
              </form-field>

              <!--
                Tax Rate
              -->
              <form-field class="field--tax-rate" :label="$t('labels.tax_rate')">
                <form-dropdown-input v-model="props.form.tax_rate" document searchable scrollable>
                  <dropdown-option v-for="(tr, index) in taxRates" :key="index" :value="tr">
                    {{ tr.name }}
                  </dropdown-option>
                </form-dropdown-input>
              </form-field>
            </template>

            <!--
              List item
            -->
            <template slot="preview" scope="row">
              <div class="list-item__field field--product">
                <div class="list-item__field list-item__index">
                  {{ row.index + 1 }}.
                </div>
                {{ row.item.product.name }}
              </div>
              <div class="list-item__field field--cost">
                <span class="currency">
                    {{ currency_symbol | currencySymbol }}
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
                    {{ currency_symbol | currencySymbol }}
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
                    {{ currency_symbol | currencySymbol }}
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
                    {{ currency_symbol | currencySymbol }}
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
                  {{ currency_symbol | currencySymbol }}
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
                  {{ currency_symbol | currencySymbol }}
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
            <form-documents-input></form-documents-input>
          </tab>
          <tab :title="$t('tabs.note_to_client')">
            <form-container name="invoice">
              <form-textarea-input v-model="form.note_to_client" :placeholder="$t('placeholders.note_to_client')" name="note_to_client" rows="12"></form-textarea-input>
            </form-container>
          </tab>
          <tab :title="$t('tabs.terms')">
            <form-container name="invoice">
              <form-textarea-input v-model="form.terms" :placeholder="$t('placeholders.invoice_terms')" name="terms" rows="12"></form-textarea-input>
            </form-container>
          </tab>
          <tab :title="$t('tabs.footer')">
            <form-container name="invoice">
              <form-textarea-input v-model="form.footer" :placeholder="$t('placeholders.invoice_footer')" name="footer" rows="12"></form-textarea-input>
            </form-container>
          </tab>
        </tabs>
      </modal-tab>
    </modal-tabs>
    <div class="modal-sidebar">
      <div class="modal-sidebar__title">
        {{ $t('sidebar.invoice_preview') }}
      </div>
      <div class="invoice__preview">
        <iframe src="http://localhost:8000/test.pdf#view=Fit&toolbar=0" scrolling="no" width="357" height="487"></iframe>
        <!-- <object type="application/pdf" data="" ></object> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-invoice',

  data() {
    return {
      itemModel: {
        product: {},
        qty: 1,
        cost: 0,
        discount: 0,
        tax_rate: null
      }
    }
  },

  computed: {
    form() {
      return this.$store.state.form.invoice
    },

    currency_symbol() {
      if (this.form.client_uuid) {
        const client = this.clients.find((client) => client.uuid === this.form.client_uuid)

        if (client && client.currency) {
          return client.currency.symbol
        }
      }
      return '$'
    },

    subtotal() {
      return this.form.items.filter((item) => item.cost)
        .map((item) => {
          return parseFloat(item.cost) * parseFloat(item.qty || 1)
        })
        .reduce((a, b) => a + b, 0)
    },

    discount() {
      return this.form.items
        .map((item) => {
          const priceSum = parseFloat(item.cost) * parseFloat(item.qty || 1)
          return priceSum * (parseFloat(item.discount) || 0) / 100
        })
        .reduce((a, b) => a + b, 0)
    },

    taxes() {
      const items = this.form.items
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
      if (this.form.uuid) {
        return parseFloat(this.form.paid_in)
      }
      return parseFloat(this.form.partial)
    },

    balance_due() {
      return this.subtotal - this.discount + this.taxes - this.paid_to_date
    },

    passive() {
      return this.$store.state.passive
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

    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/invoice/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('form/invoice/CREATE')
    },

    cancel() {
      this.$emit('cancel')
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

.vue-dropzone {
  border: 2px dashed #e1e1e1;
  min-height: 126px;
  .dz-message {
    color: $color-text;
    margin: 0 auto;
    &__title {
      font-size: 14px;
      font-weight: bold;
    }
    &__sub-title {
      margin-top: 15px;
      font-size: 13px;
    }
  }
}
</style>