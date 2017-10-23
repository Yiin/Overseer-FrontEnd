<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" :hide-buttons="preview">

      <!--
        Select client we're sending invoice to
       -->
      <modal-tab :title="$t('tabs.client')">
        <form-container>
          <form-inline-select-input
            v-if="dropdownOptions.clients.length"
            v-model="client_uuid"
            :items="dropdownOptions.clients"
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
            <form-field catch-errors="invoice_date" :label="$t('labels.invoice_date')">
              <form-date-input :current-date="!form.fields.uuid" v-model="invoice_date" name="invoice_date" :readonly="preview"></form-date-input>
            </form-field>
            <form-field catch-errors="invoice_number" :label="$t('labels.invoice_number')">
              <form-text-input v-model="invoice_number" name="invoice_number" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field catch-errors="due_date" :label="$t('labels.invoice_due_date')">
              <form-date-input v-model="due_date" name="due_date" :readonly="preview"></form-date-input>
            </form-field>
            <form-field catch-errors="po_number" :label="$t('labels.po_number')">
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
        </form-container>
      </modal-tab>

      <!--
        Invoice items
      -->
      <modal-tab :title="$t('tabs.items')">
        <form-container>

          <!-- <bill-items-list
            v-model="items"
          ></bill-items-list> -->

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
          <dropdown-option v-if="!form.fields.uuid" value="draft" :tooltip="{ content: 'Save Draft', placement: 'right' }">
            Save Draft
          </dropdown-option>
          <dropdown-option v-if="form.fields.uuid" value="save" :tooltip="{ content: 'Save Invoice', placement: 'right' }">
            Save Invoice
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
        Invoice summary
      </div>
      <div class="invoice__preview">
        <!-- <iframe src="api/pdf-preview" frameborder="0" width="700"></iframe> -->
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import FormMixin from '@/mixins/FormMixin'
import BillableDocumentMixin from '@/mixins/BillableDocumentMixin'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'
// import BillItemsList from '@/components/form/BillItemsList.vue'
import { createDocument } from '@/modules/documents/actions'

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

  computed: {
    due_date: {
      get() {
        // if document is already created, leave due date as it is
        if (this.form.fields.uuid) {
          return this.due_date
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

  methods: {
    createClient() {
      createDocument('client').then((client) => {
        this.$store.dispatch('form/invoice/SET_FORM_DATA', {
          client_uuid: client.uuid
        })
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

.button__modal--save-draft {
  background: #808080;
}

// .button__modal--mark-sent {
//   background:
// }

// .button__modal--email-invoice {
//   background:
// }

</style>