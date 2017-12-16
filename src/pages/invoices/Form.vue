<template lang="pug">
  .modal-form.scrollable
    bill-form(
      :currency='currency'
      :client='client'
      @update-items='items'
    )
      template(slot='title') Invoice

      template(slot='number')
        input(type='text' placeholder='Number' v-model='invoiceNumber' data-lpignore='true')

      template(slot='date')
        date-picker(
          current-date
          v-model='invoiceDate'
          @update-input='updateInvoiceDateInput'
        )
          input(
            slot='activator'
            slot-scope='{ parent }'
            type='text'
            placeholder='Date'
            v-model='invoiceDateFormatted'
            @focus='parent.onFocus'
            @blur='parent.onBlur'
            @input='parent.onInput'
            data-lpignore='true'
          )

      template(slot='dueDate')
        date-picker(
          current-date
          v-model='invoiceDueDate'
          @update-input='updateInvoiceDueDateInput'
        )
          input(
            slot='activator'
            slot-scope='{ parent }'
            type='text'
            placeholder='Date'
            v-model='invoiceDueDateFormatted'
            @focus='parent.onFocus'
            @blur='parent.onBlur'
            @input='parent.onInput'
            data-lpignore='true'
          )

      template(slot='buyerCompany' slot-scope='{ clients }')
        form-dropdown-input(
          :items='clients'
          :top='36'
          v-model='client_uuid'
        )
          input(
            slot='activator'
            slot-scope='{ parent }'
            type='text'
            v-model='clientName'
            placeholder='Select Client'
            @input='parent.input($event.target.value)'
            @blur='parent.onBlur'
            @focus='parent.onFocus'
          )

      template(slot='buyerName')
        input(type='text' placeholder='Name' v-model='clientName' data-lpignore='true')

      template(slot='buyerAddress')
        input(type='text' placeholder='Address' v-model='clientAddress' data-lpignore='true')

      template(slot='buyerCode')
        input(type='text' placeholder='Registration Number' v-model='clientRegistrationNumber' data-lpignore='true')

      template(slot='buyerVatCode')
        input(type='text' placeholder='Registration Number' v-model='clientVatNumber' data-lpignore='true')

      template(slot='buyerPhoneNumber')
        input(type='text' placeholder='Phone Number' v-model='clientPhoneNumber' data-lpignore='true')

      template(slot='buyerEmptyField')
        input(type='text' placeholder='' data-lpignore='true')

</template>

<script>
import FormMixin from '@/mixins/FormMixin'
import BillableDocumentMixin from '@/mixins/BillableDocumentMixin'
import BillForm from '@/components/form/bill-form/BillForm.vue'
import { createDocument } from '@/modules/documents/actions'
import DatePicker from '@/components/common/DatePicker/DatePicker.vue'
import DateFormatsMixin from '@/mixins/date/formats'

export default {
  mixins: [
    BillableDocumentMixin,
    DateFormatsMixin,
    FormMixin('invoice', [
      'client_uuid',
      'date',
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
    BillForm,
    DatePicker
  },

  data() {
    return {
      invoiceNumber: '',
      invoiceDate: null,
      invoiceDateFormatted: '',
      invoiceDueDate: null,
      invoiceDueDateFormatted: '',

      clientName: '',
      clientAddress: '',
      clientRegistrationNumber: '',
      clientVatNumber: '',
      clientPhoneNumber: ''
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
    }
  },

  watch: {
    client_uuid(uuid) {
      const client = this.$repository('clients').activeCompanyItems.find((client) => client.uuid === uuid)

      if (!client) {
        return
      }

      this.clientName = client.name
      this.clientAddress = client.address.format()
      this.clientRegistrationNumber = client.registrationNumber
      this.clientVatNumber = client.vat.vatNumber
      this.clientPhoneNumber = client.getPrimaryPhoneNumber()
    }
  },

  mounted() {
    this.initiateFields()
  },

  methods: {
    initiateFields() {
      if (this.client_uuid) {
        const client = this.$repository('clients').activeCompanyItems.find((client) => client.uuid === this.client_uuid)

        if (client) {
          this.clientName = client.name
          this.clientAddress = client.address.format()
          this.clientRegistrationNumber = client.registrationNumber
          this.clientVatNumber = client.vat.vatNumber
          this.clientPhoneNumber = client.getPrimaryPhoneNumber()
        }
      }

      this.invoiceDate = this.date
    },

    updateInvoiceDateInput(input) {
      this.invoiceDateFormatted = input
    },

    updateInvoiceDueDateInput(input) {
      this.invoiceDueDateFormatted = input
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
.modal-form {
  display: flex;
  height: 890px;
  overflow-y: auto;
}

.modal-sidebar {
  width: 473px;
  float: right;
  margin-top: 54px;
  padding-top: 24px;
  background: white;
  border-left: 4px solid $color-wild-sand;
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

</style>