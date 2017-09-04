<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.client')">
        <div class="form">
          <inline-select v-model="client" name="client" :placeholder="$t('placeholders.type_client_name')">
            <inline-option v-for="c in clients"
                          :key="c.name"
                          :value="c.name"
                          :selected="c === client">
              {{ c.name }}
            </inline-option>
          </inline-select>
        </div>
      </modal-tab>
      <modal-tab :title="$t('tabs.address')">
        <div class="form">
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.invoice_date') }}</label>
              <input class="form__input form__input--date" type="text" name="invoice_date">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.invoice_number') }}</label>
              <input class="form__input" type="text" name="invoice_number">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.invoice_due_date') }}</label>
              <input class="form__input form__input--date" type="text" name="invoice_due_date">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.po_number') }}</label>
              <input class="form__input" type="text" name="po_number">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.partial_deposit') }}</label>
              <input class="form__input" type="text" name="partial_deposit">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.discount') }}</label>
              <div class="form__inputs-group">
                <input class="form__input" type="text" name="discount">
                <dropdown class="dropdown--small">
                  <dropdown-option>{{ $t('discount_type.percent') }}</dropdown-option>
                  <dropdown-option>{{ $t('discount_type.flat') }}</dropdown-option>
                </dropdown>
              </div>
            </div>
          </div>
        </div>
      </modal-tab>
      <modal-tab :title="$t('tabs.contacts')">

      </modal-tab>
      <modal-tab :title="$t('tabs.additional_info')">

      </modal-tab>
    </modal-tabs>
    <div class="modal-sidebar">
      <div class="modal-sidebar__title">
        {{ $t('invoice.check_your_vat_number') }}
      </div>
      <div class="form__inline-inputs">
        <div class="form__input-wrapper">
          <label>{{ $t('labels.country') }}</label>
          <input v-model="country" class="form__input" type="text" name="country">
        </div>
      </div>
      <div class="form__inline-inputs">
        <div class="form__input-wrapper">
          <label>{{ $t('labels.vat_number') }}</label>
          <input v-model="vat_number" class="form__input" type="text" name="vat_number">
        </div>
      </div>
      <button class="button button--primary">
        {{ $t('common.check') }}
      </button>
      <div class="results__list scrollable">
        <div class="result result--success">
          <div class="result-border"></div>
          <div class="result-details">
            <div class="result-detail">
              VAT: <span class="result-detail__value">LT45546456456465456</span>
            </div>
            <div class="result-detail result-detail--highlight">
              Status: <span class="result-detail__value">Valid</span>
            </div>
            <div class="result-detail__title">Loneland Digital Ltd</div>
            <div class="result-detail__sub-title">Birželio 23-iosios g. 4-4, Vilniaus m., Vilniaus m. sav.</div>
            <div class="result-detail">
              Checked <span class="result-detail__value">a moment ago</span>
            </div>
            <div class="result-detail">
            </div>
            <div class="result-detail">
            </div>
          </div>
        </div>
        <div class="result result--failure">
          <div class="result-border"></div>
          <div class="result-details">
            <div class="result-detail">
              VAT: <span class="result-detail__value">LT41651521231321321</span>
            </div>
            <div class="result-detail result-detail--highlight">
              Status: <span class="result-detail__value">Valid</span>
            </div>
            <div class="result-detail">
              Checked <span class="result-detail__value">a moment ago</span>
            </div>
            <div class="result-detail">
            </div>
            <div class="result-detail">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropzone from 'vue2-dropzone'

export default {
  name: 'edit-invoice',

  components: {
    Dropzone
  },

  props: {
    data: {
      default: () => {
        return {}
      }
    }
  },

  data() {
    const current = this.data.invoice

    return {
      clients: [
        { name: 'Client A' },
        { name: 'Client B' },
        { name: 'Client C' },
        { name: 'Client D' },
        { name: 'Client E' },
        { name: 'Client F' },
        { name: 'Client G' },
        { name: 'Client H' },
        { name: 'Client I' },
        { name: 'Client J' },
        { name: 'Client K' },
        { name: 'Client L' },
        { name: 'Client M' },
        { name: 'Client N' },
        { name: 'Client O' },
        { name: 'Client P' },
        { name: 'Client Q' },
        { name: 'Client R' },
        { name: 'Client S' }
      ],

      countries: [
        { name: 'Country A' },
        { name: 'Country B' },
        { name: 'Country C' },
        { name: 'Country D' },
        { name: 'Country E' }
      ],

      currencies: [
        { name: 'Currency A' },
        { name: 'Currency B' },
        { name: 'Currency C' },
        { name: 'Currency D' },
        { name: 'Currency E' }
      ],

      languages: [
        { name: 'Language A' },
        { name: 'Language B' },
        { name: 'Language C' },
        { name: 'Language D' },
        { name: 'Language E' }
      ],

      payment_terms: [
        { name: 'Net 7' },
        { name: 'Net 14' },
        { name: 'Net 15' },
        { name: 'Net 30' },
        { name: 'Net 60' },
        { name: 'Net 90' },
        { name: 'Net 0' }
      ],

      company_sizes: [
        { name: 'Company Size A' },
        { name: 'Company Size B' },
        { name: 'Company Size C' },
        { name: 'Company Size D' },
        { name: 'Company Size E' }
      ],

      industries: [
        { name: 'Industry A' },
        { name: 'Industry B' },
        { name: 'Industry C' },
        { name: 'Industry D' },
        { name: 'Industry E' }
      ],

      client: current.client,

      name: current.name,
      registration_number: current.registration_number,
      vat_number: current.vat_number,
      website: current.website,
      phone: current.phone,
      address1: current.address1,
      address2: current.address2,
      currency: current.currency,
      postal_code: current.postal_code,
      area: current.area,
      country: current.country,
      taxRate: current.taxRate,
      city: current.city
    }
  },

  watch: {
    name: function (val) {
      this.data.invoice.name = val
    },
    price: function (val) {
      this.data.invoice.price = val
    },
    qty: function (val) {
      this.data.invoice.qty = val
    },
    currency: function (val) {
      this.data.invoice.currency = val
    },
    taxRate: function (val) {
      this.data.invoice.taxRate = val
    },
    description: function (val) {
      this.data.invoice.description = val
    }
  },

  methods: {
    showSuccess() {
      console.log('A file was successfully uploaded')
    },

    save() {
      if (this.data.invoice.key) {
        this.$store.dispatch('SAVE_ENTITY', {
          tableName: 'invoices',
          data: this.data
        })
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('CREATE_ENTITY', {
        tableName: 'invoices',
        data: this.data
      })
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
.modal-form {
  display: flex;
  height: 617px;

  .modal-tabs {
    width: 865px;
  }
}

.modal-sidebar {
  width: 295px;
  border-left: 1px solid #e1e1e1;
  float: right;
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

.vb > .vb-dragger {
    z-index: 5;
    width: 12px;
    right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0,0,0,0);
    transform: rotate3d(0,0,0,0);
    -webkit-transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    background-color: rgba(48, 121, 244,.1);
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.3);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244,.5);
}
</style>