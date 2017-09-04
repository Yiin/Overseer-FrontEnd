<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.organization')">
        <div class="form">
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.company_name') }}</label>
              <input v-model="name" class="form__input" type="text" name="company_name">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.registration_number') }}</label>
              <input v-model="registration_number" class="form__input" type="text" name="registration_number">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.vat_number') }}</label>
              <input v-model="vat_number" class="form__input" type="text" name="vat_number">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.website') }}}</label>
              <input v-model="website" class="form__input" type="text" name="website">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.phone') }}}</label>
              <input v-model="phone" class="form__input" type="text" name="phone">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Logo</label>
              <dropzone id="myVueDropzone" url="https://httpbin.org/post" v-on:vdropzone-success="showSuccess">
                <input type="hidden" name="token" value="xxx">
                <div class="dz-default dz-message">
                  <div class="dz-message__title">
                    Upload Company Logo Image
                  </div>
                  <div class="dz-message__sub-title">
                    Drag and Drop Image or Click to Browse
                  </div>
                </div>
              </dropzone>
            </div>
          </div>
        </div>
      </modal-tab>
      <modal-tab :title="$t('tabs.address')">
        <div class="form">
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.street') }}</label>
              <input v-model="address1" class="form__input" type="text" name="address1">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.apt_suite') }}</label>
              <input v-model="address2" class="form__input" type="text" name="address2">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.city') }}</label>
              <input v-model="city" class="form__input" type="text" name="city">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.postal_code') }}</label>
              <input v-model="postal_code" class="form__input" type="text" name="postal_code">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.state_province') }}</label>
              <dropdown v-model="area" :placeholder="$t('fields.state_or_province')">
                <dropdown-option v-for="c in areas"
                                 :key="c.name"
                                 :value="c.name"
                                 :selected.once="c.name === area">
                  {{ c.name }}
                </dropdown-option>
              </dropdown>
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.country') }}</label>
              <dropdown v-model="country" :placeholder="$t('fields.country')">
                <dropdown-option v-for="c in countries"
                                 :key="c.name"
                                 :value="c.name"
                                 :selected.once="c.name === country">
                  {{ c.name }}
                </dropdown-option>
              </dropdown>
            </div>
          </div>
        </div>
      </modal-tab>
      <modal-tab :title="$t('tabs.contacts')">
        <div class="form">
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.first_name') }}</label>
              <input v-model="first_name" class="form__input" type="text" name="first_name">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.last_name') }}</label>
              <input v-model="last_name" class="form__input" type="text" name="last_name">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.job_position') }}</label>
              <input v-model="job_position" class="form__input" type="text" name="job_position">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.email') }}</label>
              <input v-model="email" class="form__input" type="text" name="email">
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.phone') }}</label>
              <input v-model="phone" class="form__input" type="text" name="phone">
            </div>
          </div>
        </div>
      </modal-tab>
      <modal-tab :title="$t('tabs.additional_info')">
        <div class="form">
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.currency') }}</label>
              <dropdown v-model="currency" :placeholder="$t('fields.currency')">
                <dropdown-option v-for="c in currencies"
                                 :key="c.name"
                                 :value="c.name"
                                 :selected.once="c.name === currency">
                  {{ c.name }}
                </dropdown-option>
              </dropdown>
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.language') }}</label>
              <dropdown v-model="language" :placeholder="$t('fields.language')">
                <dropdown-option v-for="c in languages"
                                 :key="c.name"
                                 :value="c.name"
                                 :selected.once="c.name === language">
                  {{ c.name }}
                </dropdown-option>
              </dropdown>
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.payment_terms') }}</label>
              <dropdown v-model="pt" :placeholder="$t('fields.payment_terms')">
                <dropdown-option v-for="c in payment_terms"
                                 :key="c.name"
                                 :value="c.name"
                                 :selected.once="c.name === pt">
                  {{ c.name }}
                </dropdown-option>
              </dropdown>
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.company_size') }}</label>
              <dropdown v-model="company_size" :placeholder="$t('fields.company_size')">
                <dropdown-option v-for="c in company_sizes"
                                 :key="c.name"
                                 :value="c.name"
                                 :selected.once="c.name === company_size">
                  {{ c.name }}
                </dropdown-option>
              </dropdown>
            </div>
            <div class="form__input-wrapper">
              <label>{{ $t('labels.industry') }}</label>
              <dropdown v-model="industry" :placeholder="$t('fields.industry')">
                <dropdown-option v-for="c in industries"
                                 :key="c.name"
                                 :value="c.name"
                                 :selected.once="c.name === industry">
                  {{ c.name }}
                </dropdown-option>
              </dropdown>
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>{{ $t('labels.private_notes') }}</label>
              <textarea class="form__input"></textarea>
            </div>
          </div>
        </div>
      </modal-tab>
    </modal-tabs>
    <div class="modal-sidebar">
      <div class="modal-sidebar__title">
        {{ $t('client.check_your_vat_number') }}
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
  name: 'edit-client',

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
    const current = this.data.client

    return {
      areas: [
        { name: 'Area A' },
        { name: 'Area B' },
        { name: 'Area C' },
        { name: 'Area D' },
        { name: 'Area E' },
        { name: 'Area F' }
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
      this.data.client.name = val
    },
    price: function (val) {
      this.data.client.price = val
    },
    qty: function (val) {
      this.data.client.qty = val
    },
    currency: function (val) {
      this.data.client.currency = val
    },
    taxRate: function (val) {
      this.data.client.taxRate = val
    },
    description: function (val) {
      this.data.client.description = val
    }
  },

  methods: {
    showSuccess() {
      console.log('A file was successfully uploaded')
    },

    save() {
      if (this.data.client.key) {
        this.$store.dispatch('SAVE_ENTITY', {
          tableName: 'clients',
          data: this.data
        })
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('CREATE_ENTITY', {
        tableName: 'clients',
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