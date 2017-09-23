<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.organization')">
        <form-container name="vendor">
          <form-row>

            <form-field catch-errors="company_name" :label="$t('labels.company_name')">
              <form-text-input v-model="form.company_name" name="company_name"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field catch-errors="registration_number" :label="$t('labels.registration_number')">
              <form-text-input v-model="form.registration_number" name="registration_number"></form-text-input>
            </form-field>

            <form-field catch-errors="vat_number" :label="$t('labels.vat_number')">
              <form-text-input v-model="form.vat_number" name="vat_number"></form-text-input>
            </form-field>

          </form-row>
          <form-row>

            <form-field catch-errors="website" :label="$t('labels.website')">
              <form-text-input v-model="form.website" name="website"></form-text-input>
            </form-field>

            <form-field catch-errors="phone" :label="$t('labels.phone')">
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
        <form-container name="vendor">
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
            <form-field catch-errors="country_id" :label="$t('labels.country')">
              <form-dropdown-input v-model="form.country_id" name="country_id" scrollable searchable>
                <dropdown-option v-for = "country in passive.countries" :key="country.id"
                                :value = "country.id"
                                :selected="country.id === form.country_id">
                  {{ country.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.contacts')">
        <form-container name="vendor">
          <div class="contacts-list scrollable">
            <div v-for="(contact, index) in form.contacts" :key="index">
              <hr v-if="index" class="separator">
              <form-row>
                <form-field :label="$t('labels.first_name')">
                  <form-text-input v-model="contact.first_name" :name="`contact_first_name[${index}]`"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.last_name')">
                  <form-text-input v-model="contact.last_name" :name="`contact_last_name[${index}]`"></form-text-input>
                </form-field>
              </form-row>
              <form-row>
                <form-field :label="$t('labels.job_position')">
                  <form-text-input v-model="contact.job_position" :name="`contact_job_position[${index}]`"></form-text-input>
                </form-field>
              </form-row>
              <form-row>
                <form-field :label="$t('labels.email')">
                  <form-text-input v-model="contact.email" :name="`contact_email[${index}]`"></form-text-input>
                </form-field>
                <form-field :label="$t('labels.phone')">
                  <form-text-input v-model="contact.phone" :name="`contact_phone[${index}]`"></form-text-input>
                </form-field>
              </form-row>
            </div>
            <div class="add-new-block" @click="$store.dispatch('form/vendor/ADD_NEW_CONTACT')">
              {{ $t('actions.add_new_contact') }}
            </div>
          </div>
        </form-container>
      </modal-tab>
      <modal-tab :title="$t('tabs.additional_info')">
        <form-container name="vendor">
          <form-row>
            <form-field catch-errors="currency" :label="$t('labels.currency')">
              <form-dropdown-input v-model="form.currency_id" name="currency_id" scrollable searchable>
                <dropdown-option v-for="currency in passive.currencies" :key="currency.id"
                                :value="currency.id"
                                :selected="currency.id === form.currency_id">
                  {{ currency.code }} - {{ currency.name }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
    </modal-tabs>
  </div>
</template>

<script>
export default {
  name: 'edit-vendor',

  computed: {
    form() {
      return this.$store.state.form.vendor
    },

    passive() {
      return this.$store.state.passive
    }
  },

  methods: {
    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/vendor/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('form/vendor/CREATE')
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