<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill" :hide-buttons="preview">
      <modal-tab :title="$t('tabs.organization')">
        <form-container name="vendor">
          <form-row>

            <form-field catch-errors="company_name" :label="$t('labels.company_name')">
              <form-text-input v-model="form.company_name" name="company_name" :readonly="preview"></form-text-input>
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
        <form-container name="vendor">
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
          <div ref="contactsList" class="contacts-list" :class="{ scrollable: form.contacts.length > 1 }">
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
        <form-container name="vendor">
          <form-row>
            <form-field catch-errors="currency" :label="$t('labels.currency')">
              <form-dropdown-input v-model="form.currency_id" name="currency_id" scrollable searchable :readonly="preview">
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

    preview() {
      return this.form.__preview
    },

    passive() {
      return this.$store.state.passive
    }
  },

  methods: {
    addNewContact() {
      this.$store.dispatch('form/vendor/ADD_NEW_CONTACT')

      this.$nextTick(() => {
        const containerHeight = this.$refs.contactsList.scrollHeight - this.$refs.contactsList.getBoundingClientRect().height
        const speed = 1500
        let start = null

        const scroll = (timestamp) => {
          const distance = containerHeight - this.$refs.contactsList.scrollTop

          if (distance <= 0) {
            return
          }
          if (!start) {
            start = timestamp
          }
          const diffInTime = timestamp - start

          this.$refs.contactsList.scrollTop += (diffInTime / speed * 1000)
          if (this.$refs.contactsList.scrollTop >= containerHeight) {
            this.$refs.contactsList.scrollTop = containerHeight
          } else {
            window.requestAnimationFrame(scroll)
          }
          start = timestamp
        }
        window.requestAnimationFrame(scroll)
      })
    },

    removeContact(index) {
      this.$store.dispatch('form/vendor/REMOVE_CONTACT', index)
    },

    fill() {
      this.$store.dispatch('form/vendor/FILL')
    },

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