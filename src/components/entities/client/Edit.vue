<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.organization')">
        <form-container name="client">
          <form-row>

            <form-field :label="$t('labels.company_name')">
              <form-text-input name="name"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field :label="$t('labels.registration_number')">
              <form-text-input name="registration_number"></form-text-input>
            </form-field>

            <form-field :label="$t('labels.vat_number')">
              <form-text-input name="vat_number"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field :label="$t('labels.website')">
              <form-text-input name="website"></form-text-input>
            </form-field>

            <form-field :label="$t('labels.phone')">
              <form-text-input name="phone"></form-text-input>
            </form-field>

          </form-row>

          <form-row>
            <form-field :label="$t('labels.logo')">

              <form-images-input name="logo" multiple>
                <img slot="icon" src="../../../assets/icons/upload.svg">
                <template slot="title">
                  {{ $t('placeholders.upload_company_logo_image') }}
                </template>
                <template slot="subtitle">
                  {{ $t('placeholders.drag_and_drop_image_or_click_to_browse') }}
                </template>
              </form-images-input>

            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.address')">
        <form-container name="client">
          <form-row>
            <form-field :label="$t('labels.street')">
              <form-text-input name="address1"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.apt_suite')">
              <form-text-input name="address2"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.city')">
              <form-text-input name="city"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.postal_code')">
              <form-text-input name="postal_code"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.state')">
              <form-text-input name="state"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.country')">
              <form-dropdown-input name="country_id">
                <dropdown-option v-for = "country in countries" :key="country.id"
                                :value = "country.id"
                                :selected.once="country.id === form.country">
                  {{ country.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.contacts')">
        <form-container name="client">
          <form-row>
            <form-field :label="$t('labels.first_name')">
              <form-text-input name="first_name"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.last_name')">
              <form-text-input name="last_name"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.job_position')">
              <form-text-input name="job_position"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.email')">
              <form-text-input name="email"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.phone')">
              <form-text-input name="phone"></form-text-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.additional_info')">
        <form-container name="client">
          <form-row>
            <form-field :label="$t('labels.currency')">
              <form-dropdown-input name="currency_id">
                <dropdown-option v-for="currency in currencies" :key="currency.id"
                                :value="currency.id"
                                :selected.once="currency.id === form.currency">
                  {{ currency.code }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.language')">
              <form-dropdown-input name="language_id">
                <dropdown-option v-for="language in languages" :key="language.id"
                                :value="language.id"
                                :selected.once="language.id === form.language">
                  {{ language.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
            <form-field :label="$t('labels.payment_terms')">
              <form-dropdown-input name="payment_terms">
                <dropdown-option v-for="pt in payment_terms" :key="pt.id"
                                :value="pt.id"
                                :selected.once="pt.id === form.pt">
                  {{ pt.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.company_size')">
              <form-dropdown-input name="company_size_id">
                <dropdown-option v-for="company_size in company_sizes" :key="company_size.id"
                                :value="company_size.id"
                                :selected.once="company_size.id === form.company_size">
                  {{ company_size.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
            <form-field :label="$t('labels.industry')">
              <form-dropdown-input name="industry_id">
                <dropdown-option v-for="industry in industries" :key="industry.id"
                                :value="industry.id"
                                :selected.once="industry.id === form.industry">
                  {{ industry.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.private_notes')">
              <form-textarea-input name="notes" rows="4"></form-textarea-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
    </modal-tabs>
    <div class="modal-sidebar">
      <div class="modal-sidebar__title">
        {{ $t('sidebar.check_your_vat_number') }}
      </div>
      <div class="form__inline-inputs">
        <div class="form__input-wrapper">
          <label class="form__label">{{ $t('labels.country') }}</label>
          <form-dropdown-input v-model="vat_checker.country_id">
            <dropdown-option v-for = "country in countries" :key="country.id"
                            :value = "country.id"
                            :selected.once="country.id === form.country">
              {{ country.name }}
            </dropdown-option>
          </form-dropdown-input>
        </div>
      </div>
      <div class="form__inline-inputs">
        <div class="form__input-wrapper">
          <label class="form__label">{{ $t('labels.vat_number') }}</label>
          <input v-model="vat_checker.number" class="form__input" type="text" name="vat_number">
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
export default {
  name: 'edit-client',

  data() {
    return {
      areas: [
        { id: 1, name: 'Area A' },
        { id: 2, name: 'Area B' },
        { id: 3, name: 'Area C' },
        { id: 4, name: 'Area D' },
        { id: 5, name: 'Area E' },
        { id: 6, name: 'Area F' }
      ],

      countries: [
        { id: 7, name: 'Country A' },
        { id: 8, name: 'Country B' },
        { id: 9, name: 'Country C' },
        { id: 10, name: 'Country D' },
        { id: 11, name: 'Country E' }
      ],

      currencies: [
        { id: 1, code: 'Currency A' },
        { id: 2, code: 'Currency B' },
        { id: 3, code: 'Currency C' },
        { id: 4, code: 'Currency D' },
        { id: 5, code: 'Currency E' }
      ],

      languages: [
        { id: 6, name: 'Language A' },
        { id: 7, name: 'Language B' },
        { id: 8, name: 'Language C' },
        { id: 9, name: 'Language D' },
        { id: 10, name: 'Language E' }
      ],

      payment_terms: [
        { id: 11, name: 'Net 7' },
        { id: 12, name: 'Net 14' },
        { id: 13, name: 'Net 15' },
        { id: 14, name: 'Net 30' },
        { id: 15, name: 'Net 60' },
        { id: 16, name: 'Net 90' },
        { id: 17, name: 'Net 0' }
      ],

      company_sizes: [
        { id: 18, name: 'Company Size A' },
        { id: 19, name: 'Company Size B' },
        { id: 20, name: 'Company Size C' },
        { id: 21, name: 'Company Size D' },
        { id: 22, name: 'Company Size E' }
      ],

      industries: [
        { id: 23, name: 'Industry A' },
        { id: 24, name: 'Industry B' },
        { id: 25, name: 'Industry C' },
        { id: 26, name: 'Industry D' },
        { id: 27, name: 'Industry E' }
      ],

      vat_checker: {
        country: '',
        number: ''
      }
    }
  },

  computed: {
    form() {
      return this.$store.state.form.client
    }
  },

  methods: {
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