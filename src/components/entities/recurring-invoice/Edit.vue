<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">

      <!--
        Select client we're sending recurring_invoice to
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container name="recurring_invoice">
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
        Invoice details
      -->
      <modal-tab :title="$t('tabs.details')">
        <form-container name="recurring_invoice">
          <form-row>

            <!--
              Start Date
            -->
            <form-field :label="$t('labels.start_date')">
              <form-date-input name="start_date"></form-date-input>
            </form-field>

            <!--
              Frequency
            -->
            <form-field :label="$t('labels.frequency')">
              <form-dropdown-input name="frequency" scrollable>
                <dropdown-option v-for="(frequency, index) in frequencies" :key="index" :value="`${frequency.value}:${frequency.type}`">
                  {{ frequency.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>

          <form-row>

            <!--
              End Date
            -->
            <form-field :label="$t('labels.end_date')">
              <form-date-input name="end_date"></form-date-input>
            </form-field>

            <!--
              Due Date
            -->
            <form-field :label="$t('labels.due_date')">
              <form-dropdown-input name="due_date" :watch="dueDates" scrollable>
                <dropdown-option v-for="(dueDate, index) in dueDates" :key="index" :value="dueDate.value">
                  {{ $t(`due_date.${dueDate.name}`) }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>

          <form-row>

            <!--
              Invoice Number
            -->
            <form-field :label="$t('labels.invoice_number')">
              <form-text-input name="invoice_number"></form-text-input>
            </form-field>

            <!--
              PO Number
            -->
            <form-field :label="$t('labels.po_number')">
              <form-text-input name="po_number"></form-text-input>
            </form-field>
          </form-row>

          <form-row>

            <!--
              Partial
            -->
            <form-field :label="$t('labels.partial')">
              <form-date-input name="partial"></form-date-input>
            </form-field>

            <!--
              Autobill
            -->
            <form-field :label="$t('labels.autobill')">
              <form-dropdown-input name="autobill">
                <dropdown-option :value="false" :selected="true">{{ $t('common.off') }}</dropdown-option>
                <dropdown-option :value="true">{{ $t('common.on') }}</dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>

          <form-row>

            <!--
              Discount
            -->
            <form-field :label="$t('labels.discount')">
              <form-inputs-group>
                <form-text-input name="discount_value"></form-text-input>
                <form-dropdown-input name="discount_type">
                  <dropdown-option :selected="true">{{ $t('discount_type.percent') }}</dropdown-option>
                  <dropdown-option>{{ $t('discount_type.flat') }}</dropdown-option>
                </form-dropdown-input>
              </form-inputs-group>
            </form-field>
          </form-row>

        </form-container>
      </modal-tab>

      <!--
        recurring_Invoice items
      -->
      <modal-tab :title="$t('tabs.items')">
        <form-container name="recurring_invoice">

          <form-items-list :model="tmpItem" @add="onAdd" name="items">

            <!--
              New item form
            -->
            <template slot="fields">

              <!--
                Product
              -->
              <form-field class="field--product" :label="$t('labels.item')">
                <form-dropdown-input v-model="tmpItem.product" with-text searchable scrollable>
                  <dropdown-option v-for="(product, index) in products" :key="index" :value="product.uuid">
                    {{ product.name }}
                  </dropdown-option>
                </form-dropdown-input>
              </form-field>

              <!--
                Unit Price
              -->
              <form-field class="field--cost" :label="$t('labels.unit_cost')">
                <form-text-input v-model="tmpItem.cost" name="price"></form-text-input>
              </form-field>

              <!--
                Quantity
              -->
              <form-field class="field--qty" :label="$t('labels.qty')">
                <form-text-input v-model="tmpItem.qty" name="qty"></form-text-input>
              </form-field>

              <!--
                Discount
              -->
              <form-field class="field--discount" :label="$t('labels.discount')">
                <form-text-input v-model="tmpItem.discount" name="discount"></form-text-input>
              </form-field>

              <!--
                Tax Rate
              -->
              <form-field class="field--tax-rate" :label="$t('labels.tax_rate')">
                <form-dropdown-input v-model="tmpItem.taxRate" with-text searchable scrollable>
                  <dropdown-option v-for="(tr, index) in taxRates" :key="index" :value="tr.uuid">
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
                {{ row.item.product.text }}
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
                <span class="currency">
                    {{ currency_symbol | currencySymbol }}
                </span>
                <span class="currency currency--primary">
                    {{ row.item.discount | currency }}
                </span>
              </div>
              <div class="list-item__field field--tax-rate">
                {{ row.item.taxRate.text }}
              </div>
            </template>

            <template slot="summary">
              <div class="summary-block">
                <label class="summary-block__title">
                    Subtotal
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
                    Discount
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
                    Taxes
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
                  Paid to Date
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
                  Balance Due
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

          </tab>
          <tab :title="$t('tabs.note_to_client')">
            <form-container name="recurring_invoice">
              <form-textarea-input :placeholder="$t('placeholders.note_to_client')" name="note_to_client" rows="12"></form-textarea-input>
            </form-container>
          </tab>
          <tab :title="$t('tabs.terms')">
            <form-container name="recurring_invoice">
              <form-textarea-input :placeholder="$t('placeholders.invoice_terms')" name="terms" rows="12"></form-textarea-input>
            </form-container>
          </tab>
          <tab :title="$t('tabs.footer')">
            <form-container name="recurring_invoice">
              <form-textarea-input :placeholder="$t('placeholders.invoice_footer')" name="footer" rows="12"></form-textarea-input>
            </form-container>
          </tab>
        </tabs>
      </modal-tab>
    </modal-tabs>
    <div class="modal-sidebar">
      <div class="modal-sidebar__title">
        {{ $t('sidebar.recurring_invoice_preview') }}
      </div>
      <div class="recurring_invoice__preview">
        <object type="application/pdf" data="http://localhost:8000/test.pdf#view=Fit&toolbar=0" width="357" height="487"></object>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-recurring-invoice',

  data() {
    return {
      clients: [
        { uuid: '0001', name: 'Client A' },
        { uuid: '0002', name: 'Client B' },
        { uuid: '0003', name: 'Client C' },
        { uuid: '0004', name: 'Client D' },
        { uuid: '0005', name: 'Client E' }
      ],

      products: [
        { uuid: '0001', name: 'Product A' },
        { uuid: '0002', name: 'Product B' },
        { uuid: '0003', name: 'Product C' },
        { uuid: '0004', name: 'Product D' },
        { uuid: '0005', name: 'Product E' },
        { uuid: '0006', name: 'Product F' },
        { uuid: '0007', name: 'Product G' },
        { uuid: '0008', name: 'Product H' },
        { uuid: '0009', name: 'Product I' },
        { uuid: '0010', name: 'Product J' }
      ],

      taxRates: [
        { uuid: '0001', name: 'VAT', rate: 10, is_inclusive: false },
        { uuid: '0002', name: 'Tobacco', rate: 15, is_inclusive: false },
        { uuid: '0003', name: 'Alkohol', rate: 20, is_inclusive: true }
      ],

      tmpItem: {
        product: {
          text: '',
          value: ''
        },
        qty: 1,
        cost: 0,
        discount: 0,
        taxRate: {
          text: '',
          value: ''
        }
      }
    }
  },

  computed: {
    form() {
      return this.$store.state.form.recurring_invoice
    },

    frequencies() {
      return [
        { name: 'weekly', value: 1, type: 'week' },
        { name: 'two_weeks', value: 2, type: 'week' },
        { name: 'four_weeks', value: 4, type: 'week' },
        { name: 'monthly', value: 1, type: 'month' },
        { name: 'two_months', value: 2, type: 'month' },
        { name: 'three_months', value: 3, type: 'month' },
        { name: 'six_months', value: 6, type: 'month' },
        { name: 'annually', value: 1, type: 'year' }
      ]
    },

    dueDates() {
      let dates = [
        { name: 'use_client_terms', value: 0 }
      ]

      if (!this.form.frequency) {
        return dates
      }

      switch (this.form.frequency.split(':')[1]) {
      case 'week':
        const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        for (let i = 1, value = 1; i <= 4; ++i) {
          weekdays.forEach((weekday) => {
            dates.push({
              name: `${i}_${weekday}_after`,
              value: value++
            })
          })
        }
        break
      case 'month':
      case 'year':
        for (let i = 1; i <= 30; ++i) {
          dates.push({
            name: `${i}_day_of_the_month`,
            value: i
          })
        }
        dates.push({
          name: `last_day_of_the_month`,
          value: 31
        })
        break
      }
      return dates
    },

    currency_symbol() {
      return '$'
    },

    recurring_invoice_amount() {
      return this.form.items.filter((item) => item.cost)
        .map((item) => parseFloat(item.cost) * parseFloat(item.qty || 1))
        .reduce((a, b) => a + b, 0)
    },

    subtotal() {
      return this.recurring_invoice_amount
    },

    discount() {
      return this.form.items.map((item) => parseFloat(item.discount))
        .reduce((a, b) => a + b, 0)
    },

    taxes() {
      const items = this.form.items
      let taxes = 0 // flat

      for (let i = 0; i < items.length; ++i) {
        if (!items[i].taxRate) {
          continue
        }

        const tax = this.taxRates.find((taxRate) => taxRate.uuid === items[i].taxRate)

        if (!tax) {
          continue
        }

        taxes += parseFloat(tax.rate) * parseFloat(items[i].cost) / 100
      }
      return taxes
    },

    paid_to_date() {
      return 0.00
    },

    balance_due() {
      return this.recurring_invoice_amount + this.taxes
    }

  },

  methods: {
    onAdd() {
      this.tmpItem.product = {
        text: '',
        value: ''
      }
      this.tmpItem.qty = 1
      this.tmpItem.cost = 0
      this.tmpItem.discount = 0
      this.tmpItem.taxRate = {
        text: '',
        value: ''
      }
    },

    save() {
      if (this.data.recurring_invoice.key) {
        this.$store.dispatch('SAVE_ENTITY', {
          tableName: 'recurring_invoices',
          data: this.data
        })
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('CREATE_ENTITY', {
        tableName: 'recurring_invoices',
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