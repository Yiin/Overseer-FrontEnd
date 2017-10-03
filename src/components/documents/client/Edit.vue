<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill" :hide-buttons="preview">
      <modal-tab :title="$t('tabs.organization')">
        <form-container name="client">
          <form-row>

            <form-field catch-errors="name" :label="$t('labels.company_name')">
              <form-text-input v-model="form.name" name="name" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field catch-errors="registration_number" :label="$t('labels.registration_number')">
              <form-text-input v-model="form.registration_number" name="registration_number" :readonly="preview"></form-text-input>
            </form-field>

            <form-field catch-errors="vat_number" :label="$t('labels.vat_number')">
              <form-text-input v-model="form.vat_number" name="vat_number" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field catch-errors="website" :label="$t('labels.website')">
              <form-text-input v-model="form.website" name="website" :readonly="preview"></form-text-input>
            </form-field>

            <form-field catch-errors="phone" :label="$t('labels.phone')">
              <form-text-input v-model="form.phone" name="phone" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>

          <form-row>
            <form-field>

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
              <form-text-input v-model="form.address1" name="address1" :readonly="preview"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.apt_suite')">
              <form-text-input v-model="form.address2" name="address2" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.city')">
              <form-text-input v-model="form.city" name="city" :readonly="preview"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.postal_code')">
              <form-text-input v-model="form.postal_code" name="postal_code" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.state')">
              <form-text-input v-model="form.state" name="state" :readonly="preview"></form-text-input>
            </form-field>
            <form-field catch-errors="country_id" :label="$t('labels.country')">
              <form-dropdown-input v-model="form.country_id" name="country_id" scrollable searchable :readonly="preview">
                <dropdown-option v-for = "country in passive.countries" :key="country.id"
                                :value = "country.id"
                                :selected.once="country.id === form.country_id">
                  {{ country.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.contacts')">
        <form-container name="client">
          <div ref="contactsList" class="contacts-list" :class="{ 'scrollable': form.contacts.length > 1 }">
            <div v-for="(contact, index) in form.contacts" :key="index" class="contact__form">
              <hr v-if="index" class="separator">
              <div v-if="index" class="contact__index"><span>{{ index + 1 }}.</span></div>
              <div v-if="index && !preview" @click="removeContact(index)" class="delete-contact"></div>
              <form-row>
                <form-field :label="$t('labels.first_name')">
                  <form-text-input v-model="contact.first_name" :name="`contact_first_name[${index}]`" :readonly="preview"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.last_name')">
                  <form-text-input v-model="contact.last_name" :name="`contact_last_name[${index}]`" :readonly="preview"></form-text-input>
                </form-field>
              </form-row>
              <form-row>
                <form-field :label="$t('labels.job_position')">
                  <form-text-input v-model="contact.job_position" :name="`contact_job_position[${index}]`" :readonly="preview"></form-text-input>
                </form-field>
              </form-row>
              <form-row>
                <form-field :label="$t('labels.email')">
                  <form-text-input v-model="contact.email" :name="`contact_email[${index}]`" :readonly="preview"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.phone')">
                  <form-text-input v-model="contact.phone" :name="`contact_phone[${index}]`" :readonly="preview"></form-text-input>
                </form-field>
              </form-row>
            </div>
            <div v-if="!preview" class="add-new-block" @click="addNewContact">
              {{ $t('actions.add_new_contact') }}
            </div>
          </div>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.additional_info')">
        <form-container name="client">
          <form-row>
            <form-field catch-errors="currenty_id" :label="$t('labels.currency')">
              <form-dropdown-input v-model="form.currency_id" :watch="passive.currencies" name="currency_id" scrollable searchable :readonly="preview">
                <dropdown-option v-for="currency in passive.currencies" :key="currency.id"
                                :value="currency.id"
                                :selected.once="currency.id === form.currency_id">
                  {{ currency.code }} - {{ currency.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field catch-errors="language_id" :label="$t('labels.language')">
              <form-dropdown-input v-model="form.language_id" :watch="passive.languages" name="language_id" scrollable searchable :readonly="preview">
                <dropdown-option v-for="language in passive.languages" :key="language.id"
                                :value="language.id"
                                :selected.once="language.id === form.language_id">
                  {{ language.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
            <form-field catch-errors="payment_terms" :label="$t('labels.payment_terms')">
              <form-dropdown-input v-model="form.payment_terms" :watch="passive.paymentTerms" name="payment_terms" scrollable searchable :readonly="preview">
                <dropdown-option v-for="pt in passive.paymentTerms" :key="pt.id"
                                :value="pt.id"
                                :selected.once="pt.id === form.payment_terms">
                  {{ pt.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field catch-errors="company_size_id" :label="$t('labels.company_size')">
              <form-dropdown-input v-model="form.company_size_id" :watch="passive.company_sizes" name="company_size_id" scrollable searchable :readonly="preview">
                <dropdown-option v-for="company_size in passive.companySizes" :key="company_size.id"
                                :value="company_size.id"
                                :selected.once="company_size.id === form.company_size_id">
                  {{ company_size.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
            <form-field :label="$t('labels.industry')">
              <form-dropdown-input catch-errors="industry_id" :watch="passive.industries" v-model="form.industry_id" name="industry_id" scrollable searchable :readonly="preview">
                <dropdown-option v-for="industry in passive.industries" :key="industry.id"
                                :value="industry.id"
                                :selected.once="industry.id === form.industry_id">
                  {{ industry.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
    </modal-tabs>
    <div v-if="!preview" class="modal-sidebar">
      <div class="modal-sidebar__title">
        {{ $t('sidebar.check_your_vat_number') }}
      </div>
      <div class="form__inline-inputs">
        <div class="form__input-wrapper form">
          <label class="form__label">{{ $t('labels.country') }}</label>
          <form-dropdown-input :watch="passive.countries" v-model="vat_checker.country_code" class="dropdown--member-states dropdown--hide-overflow" scrollable>
            <dropdown-option v-for = "country in passive.member_states" :key="country.id"
                            :value = "country.code"
                            :title = "country.name">
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
      <button @click="checkVat" class="button button--primary">
        {{ $t('common.check') }}
      </button>
      <div class="results__list scrollable">
        <div v-for = "result in vatCheckerResults"
             class = "result"
            :class = "{
              'result--success': result.status === 'valid',
              'result--failure': result.status === 'invalid'
            }"
        >
          <div class="result-border"></div>
          <div class="result-details">
            <div class="result-detail">
              VAT: <span class="result-detail__value">{{ result.country_code + result.number }}</span>
            </div>
            <div class="result-detail result-detail--highlight">
              Status: <span class="result-detail__value">{{ $t(`vat_status.${result.status}`) }}</span>
            </div>
            <div v-if="result.name" class="result-detail__title">
              {{ result.name }}
            </div>
            <div v-if="result.address" class="result-detail__sub-title">
              {{ result.address }}
            </div>
            <div class="result-detail">
              Checked <span class="result-detail__value">{{ result.checked_time_ago }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { smoothScrollToBottom } from '@/scripts'

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
        country_code: '',
        number: ''
      }
    }
  },

  watch: {
    'vat_checker.number': function (number) {
      const cc = number.slice(0, 2)
      const memberState = this.passive.member_states.find((state) => state.code === cc)

      if (memberState) {
        this.vat_checker.country_code = cc
        this.vat_checker.number = number.slice(2)
      }
    }
  },

  computed: {
    form() {
      return this.$store.state.form.client
    },

    preview() {
      return this.form.__preview
    },

    passive() {
      return this.$store.state.passive
    },

    vatCheckerResults() {
      return this.$store.state.features.vat_checker.results.map((result) => {
        result.checked_time_ago = moment(result.created_at).fromNow()
        return result
      })
    }
  },

  methods: {
    addNewContact() {
      this.$store.dispatch('form/client/ADD_NEW_CONTACT')

      this.$nextTick(() => smoothScrollToBottom(this.$refs.contactsList))
    },

    removeContact(index) {
      this.$store.dispatch('form/client/REMOVE_CONTACT', index)
    },

    fill() {
      this.$store.dispatch('form/client/FILL')
    },

    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/client/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('features/vat_checker/REMOVE_CHECKS', {
        country_code: this.form.vat_number.slice(0, 2),
        number: this.form.vat_number.slice(2)
      })
      this.$store.dispatch('form/client/CREATE')
    },

    checkVat() {
      this.$store.dispatch('features/vat_checker/CHECK_VAT', this.vat_checker)
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
    width: 865px;
  }
}

.modal-sidebar {
  width: 295px;
  border-left: 1px solid #e1e1e1;
  float: right;
}

.dropdown--member-states {
  .dropdown__options {
    max-height: 330px;
  }
}

label.form__input.form__input--file-upload.file-uploads.file-uploads-html5.file-uploads-drop {
    margin-top: -20px;
    height: 148px;
}

// Contact index
.contact__index {
    position: absolute;
    top: 17px;
    right: 35px;
    font-size: 16px;
    font-weight: 700;
    color: $color-main;
    line-height: 29px;
    letter-spacing: 2px;
}

.contact__index span {
    color: $color-main;
    padding-left: 5px;
    font-weight: 800;
}

.contact__index::before {
    content: '';
    position: absolute;
    border-right: 1px solid $color-mine-shaft;
    border-color: transparent;
    height: 30px;
    right: -12px;
    top: -1px;
}
</style>