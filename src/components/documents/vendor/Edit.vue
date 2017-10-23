<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill" :hide-buttons="preview">
      <modal-tab :title="$t('tabs.organization')">
        <form-container>
          <form-row>

            <form-field catch-errors="company_name" :label="$t('labels.company_name')">
              <form-text-input v-model="company_name" name="company_name" :readonly="preview"></form-text-input>
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
          <div ref="contactsList" class="contacts-list" :class="{ scrollable: contacts.length > 1 }">
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
        </form-container>
      </modal-tab>
    </modal-tabs>
  </div>
</template>

<script>
import FormMixin from '@/mixins/FormMixin'
import ContactsMixin from '@/mixins/ContactsMixin'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'

export default {
  mixins: [
    ContactsMixin('vendor'),
    FormMixin('vendor', [
      'company_name',
      'registration_number',
      'vat_number',
      'website',
      'phone',
      'logo',
      'address1',
      'address2',
      'city',
      'postal_code',
      'state',
      'country_id',
      'contacts',
      'currency_code',
      'notes'
    ])
  ],

  components: {
    FormCurrencyDropdown
  }
}
</script>

<style lang="scss">
label.form__input.form__input--file-upload.file-uploads.file-uploads-html5.file-uploads-drop {
    margin-top: -20px;
    height: 148px;
}
</style>

<style lang="scss" scoped>
.modal-form {
  display: flex;
  height: 617px;

  .modal-tabs {
    width: 865px;
  }
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