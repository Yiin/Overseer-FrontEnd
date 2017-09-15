<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.organization')">
        <form-container name="client">
          <form-row>

            <form-field catch-errors="client.name" :label="$t('labels.company_name')">
              <form-text-input v-model="form.name" name="name"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field :label="$t('labels.registration_number')">
              <form-text-input v-model="form.registration_number" name="registration_number"></form-text-input>
            </form-field>

            <form-field :label="$t('labels.vat_number')">
              <form-text-input v-model="form.vat_number" name="vat_number"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field :label="$t('labels.website')">
              <form-text-input v-model="form.website" name="website"></form-text-input>
            </form-field>

            <form-field :label="$t('labels.phone')">
              <form-text-input v-model="form.phone" name="phone"></form-text-input>
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
              <form-text-input v-model="form.address1" name="address1"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.apt_suite')">
              <form-text-input v-model="form.address2" name="address2"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.city')">
              <form-text-input v-model="form.city" name="city"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.postal_code')">
              <form-text-input v-model="form.postal_code" name="postal_code"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.state')">
              <form-text-input v-model="form.state" name="state"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.country')">
              <form-dropdown-input v-model="form.country_id" name="country_id" scrollable searchable>
                <dropdown-option v-for = "country in passive.countries" :key="country.id"
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
          <div class="contacts-list scrollable">
            <div v-for="(contact, index) in form.contacts">
              <hr v-if="index" class="separator">
              <form-row>
                <form-field :label="$t('labels.first_name')">
                  <form-text-input v-model="contact.first_name" :name="`contact_first_name:${index}`"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.last_name')">
                  <form-text-input v-model="contact.last_name" :name="`contact_last_name:${index}`"></form-text-input>
                </form-field>
              </form-row>
              <form-row>
                <form-field :label="$t('labels.job_position')">
                  <form-text-input v-model="contact.job_position" :name="`contact_job_position:${index}`"></form-text-input>
                </form-field>
              </form-row>
              <form-row>
                <form-field :label="$t('labels.email')">
                  <form-text-input v-model="contact.email" :name="`contact_email:${index}`"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.phone')">
                  <form-text-input v-model="contact.phone" :name="`contact_phone:${index}`"></form-text-input>
                </form-field>
              </form-row>
            </div>
            <div class="add-new-block" @click="$store.dispatch('form/client/ADD_NEW_CONTACT')">
              {{ $t('actions.add_new_contact') }}
            </div>
          </div>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.additional_info')">
        <form-container name="client">
          <form-row>
            <form-field :label="$t('labels.currency')">
              <form-dropdown-input v-model="form.currency_id" name="currency_id" scrollable searchable>
                <dropdown-option v-for="currency in passive.currencies" :key="currency.id"
                                :value="currency.id"
                                :selected.once="currency.id === form.currency">
                  {{ currency.code }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.language')">
              <form-dropdown-input v-model="form.language_id" name="language_id" scrollable searchable>
                <dropdown-option v-for="language in passive.languages" :key="language.id"
                                :value="language.id"
                                :selected.once="language.id === form.language">
                  {{ language.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
            <form-field :label="$t('labels.payment_terms')">
              <form-dropdown-input v-model="form.payment_terms" name="payment_terms" scrollable searchable>
                <dropdown-option v-for="pt in passive.payment_terms" :key="pt.id"
                                :value="pt.id"
                                :selected.once="pt.id === form.pt">
                  {{ pt.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.company_size')">
              <form-dropdown-input v-model="form.company_size_id" name="company_size_id" scrollable searchable>
                <dropdown-option v-for="company_size in passive.company_sizes" :key="company_size.id"
                                :value="company_size.id"
                                :selected.once="company_size.id === form.company_size">
                  {{ company_size.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
            <form-field :label="$t('labels.industry')">
              <form-dropdown-input v-model="form.industry_id" name="industry_id" scrollable searchable>
                <dropdown-option v-for="industry in passive.industries" :key="industry.id"
                                :value="industry.id"
                                :selected.once="industry.id === form.industry">
                  {{ industry.name }}
                </dropdown-option>
              </form-dropdown-input>
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
            <dropdown-option v-for = "country in passive.countries" :key="country.id"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-client',

  props: {
    data: {
      default: null
    }
  },

  data() {
    return {
      vat_checker: {
        country: '',
        number: ''
      }
    }
  },

  computed: {
    form() {
      return this.$store.state.form.client
    },

    passive() {
      return this.$store.state.passive
    }
  },

  methods: {
    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/client/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('form/client/CREATE')
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

.contacts-list {
  padding-right: 20px;
  height: 366px;

  .separator {
    margin: 40px 0;
  }
}

.add-new-block {
  padding: 20px;
  position: relative;

  &, &::before {
    font-weight: $font-weight-semibold;
    color: $color-main;
    cursor: pointer;
    font-size: 16px;
  }
  &::before {
    content: "+";
    font-weight: bold;
    position: absolute;
    left: 0;
  }
}
</style>