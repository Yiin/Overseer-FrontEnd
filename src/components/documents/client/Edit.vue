<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill" :hide-buttons="preview">
      <modal-tab :title="$t('tabs.organization')">
        <form-container>
          <form-row>

            <form-field catch-errors="name" :label="$t('labels.company_name')">
              <form-text-input v-model="name" name="name" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field catch-errors="registration_number" :label="$t('labels.registration_number')">
              <form-text-input v-model="registration_number" name="registration_number" :readonly="preview"></form-text-input>
            </form-field>

            <form-field catch-errors="vat_number" :label="$t('labels.vat_number')">
              <form-text-input v-model="vat_number" name="vat_number" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field catch-errors="website" :label="$t('labels.website')">
              <form-text-input v-model="website" name="website" :readonly="preview"></form-text-input>
            </form-field>

            <form-field catch-errors="phone" :label="$t('labels.phone')">
              <form-text-input v-model="phone" name="phone" :readonly="preview"></form-text-input>
            </form-field>

          </form-row>

          <form-row>
            <form-field>

              <form-images-input name="logo" multiple>
                <img slot="icon" src="../../../assets/icons/image.svg">
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
        <form-container>
          <form-row>
            <form-field :label="$t('labels.state')">
              <form-text-input v-model="state" name="state" :readonly="preview"></form-text-input>
            </form-field>
            <form-field catch-errors="country_id" :label="$t('labels.country')">
              <form-dropdown-input
                v-model="country_id"
                :items="dropdownOptions.countries"
              >
                <template slot="option" slot-scope="{ item, parent }">
                  <v-list-tile avatar @click="parent.select(item)">
                    <v-list-tile-avatar>
                      <span class="flag-icon" :class="['flag-icon-' + item.iso_3166_2.toLowerCase() ]"></span>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.text"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="item.full_name"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.city')">
              <form-text-input v-model="city" name="city" :readonly="preview"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.postal_code')">
              <form-text-input v-model="postal_code" name="postal_code" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.street')">
              <form-text-input v-model="address1" name="address1" :readonly="preview"></form-text-input>
            </form-field>
            <form-field :label="$t('labels.apt_suite')">
              <form-text-input v-model="address2" name="address2" :readonly="preview"></form-text-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.contacts')">
        <form-container>
          <div ref="contactsList" class="contacts-list" :class="{ 'scrollable': contacts.length > 1 }">
            <div v-for="(contact, index) in contacts" :key="index" class="contact__form">
              <hr v-if="index" class="separator">
              <div v-if="index" class="contact__index"><span>{{ index + 1 }}.</span></div>
              <div v-if="index && !preview" @click="removeContact(index)" class="delete-contact"></div>
              <form-row>
                <form-field :label="$t('labels.first_name')">
                  <form-text-input :value="contact.first_name" @input="updateContact(index, 'first_name', $event)" name="first_name" :readonly="preview"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.last_name')">
                  <form-text-input :value="contact.last_name" @input="updateContact(index, 'last_name', $event)" name="last_name" :readonly="preview"></form-text-input>
                </form-field>
              </form-row>
              <form-row>
                <form-field :label="$t('labels.job_position')">
                  <form-text-input :value="contact.job_position" @input="updateContact(index, 'job_position', $event)" name="job_position" :readonly="preview"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.linkedin_profile')">
                  <form-text-input :value="contact.linkedin_profile" @input="updateContact(index, 'linkedin_profile', $event)" name="linkedin_profile" :readonly="preview"></form-text-input>
                </form-field>
              </form-row>
              <form-row>
                <form-field :label="$t('labels.email')">
                  <form-text-input :value="contact.email" @input="updateContact(index, 'email', $event)" name="email" :readonly="preview"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.phone')">
                  <form-text-input :value="contact.phone" @input="updateContact(index, 'phone', $event)" name="phone" :readonly="preview"></form-text-input>
                </form-field>
              </form-row>
            </div>
          </div>
          <div v-if="!preview" class="add-new-block" @click="addNewContact">
            {{ $t('actions.add_new_contact') }}
          </div>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.additional_info')">
        <form-container>
          <form-row>
            <form-currency-dropdown v-model="currency_code" :readonly="preview"></form-currency-dropdown>
          </form-row>
          <form-row>
            <form-field catch-errors="language_id" :label="$t('labels.language')">
              <form-dropdown-input
                v-model="language_id"
                :items="dropdownOptions.languages"
              ></form-dropdown-input>
            </form-field>
            <form-field catch-errors="industry_id" :label="$t('labels.industry')">
              <form-dropdown-input
                v-model="industry_id"
                :items="dropdownOptions.industries"
              ></form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field catch-errors="company_size_id" :label="$t('labels.company_size')">
              <form-dropdown-input
                v-model="company_size_id"
                :items="dropdownOptions.companySizes"
              ></form-dropdown-input>
            </form-field>
            <form-field catch-errors="payment_terms" :label="$t('labels.payment_terms')">
              <form-dropdown-input
                v-model="payment_terms"
                :items="dropdownOptions.paymentTerms"
              ></form-dropdown-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
    </modal-tabs>
    <div v-if="!preview" class="modal-sidebar">
      <div class="form__inline-inputs">
        <div class="form__input-wrapper form">
          <label class="form__label">{{ $t('labels.country_code') }}</label>
          <form-dropdown-input
            v-model="vat_checker.country_code"
            :items="dropdownOptions.memberStates"
          >
            <template slot="option" slot-scope="{ item, parent }">
              <v-list-tile avatar @click="parent.select(item)">
                <v-list-tile-avatar>
                  <span class="flag-icon" :class="['flag-icon-' + item.code.toLowerCase() ]"></span>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.code"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.name"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
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
      <div class="results__list scrollable" :class="{ 'result__list--empty': !vatCheckerResults.length }">
        <div v-if="!vatCheckerResults.length" class="placeholder__text">
          You can use this tool to<br>
          validate a VAT number.
        </div>
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
import FormMixin from '@/mixins/FormMixin'
import ContactsMixin from '@/mixins/ContactsMixin'
import VatCheckerMixin from '@/mixins/VatCheckerMixin'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'

export default {
  mixins: [
    VatCheckerMixin,
    ContactsMixin('client'),
    FormMixin('client', [
      /**
       * Fields
       */
      // Organization
      'name',
      'registration_number',
      'vat_number',
      'website',
      'phone',
      'logo',

      // Address
      'address1',
      'address2',
      'city',
      'postal_code',
      'state',
      'country_id',

      // Contacts
      'contacts',

      // Additional info
      'currency_code',
      'language_id',
      'payment_terms',
      'company_size_id',
      'industry_id'
    ])
  ],

  components: {
    FormCurrencyDropdown
  },

  methods: {
    onCreate() {
      if (this.$store.state.auth.user.guest_key) {
        this.$store.dispatch('features/vat_checker/REMOVE_CHECKS', {
          country_code: this.vat_number.slice(0, 2),
          number: this.vat_number.slice(2)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-form {
  display: flex;
  height: 617px;

  .modal-tabs {
    width: 835px;
  }
}

.result__list--empty {
  background-image: url(../../../assets/images/placeholders/VatGirl.svg);
  background-size: 295px auto;
  background-position-x: -31px;
  background-position-y: -14px;
  height: 100%;
  border-top: none;
  max-height: 297px;
  margin-top: 0;
  position: relative;

  .placeholder__text {
    position: absolute;
    bottom: 5px;
    font-size: 16px;
    margin: 30px 30px 23px 32px;
    line-height: 20px;
    text-align: center;
  }
}

.modal-sidebar {
  width: 330px;
  background: #ffffff;
  margin-top: 54px;
  margin-left: 30px;
  padding: 38px 45px 0;
  z-index: 1;
  box-shadow: 0 -4px 17px rgba(0, 0, 0, 0.03);
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