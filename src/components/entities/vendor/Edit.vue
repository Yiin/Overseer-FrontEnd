<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.organization')">
        <form-container name="vendor">
          <form-row>

            <form-field :label="$t('labels.company_name')">
              <form-text-input name="company_name"></form-text-input>
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
        <form-container name="vendor">
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
              <form-dropdown-input name="country">
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
        <form-container name="vendor">
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
        <form-container name="vendor">
          <form-row>
            <form-field :label="$t('labels.currency')">
              <form-dropdown-input name="currency">
                <dropdown-option v-for="currency in currencies" :key="currency.id"
                                :value="currency.id"
                                :selected.once="currency.id === form.currency">
                  {{ currency.code }}
                </dropdown-option>
              </form-dropdown-input>
            </form-field>
          </form-row>
          <form-row>
            <form-field :label="$t('labels.private_notes')">
              <form-textarea-input name="private_notes" rows="12"></form-textarea-input>
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

      vat_checker: {
        country: '',
        number: ''
      }
    }
  },

  computed: {
    form() {
      return this.$store.state.form.vendor
    }
  },

  methods: {
    save() {
      if (this.data.vendor.key) {
        this.$store.dispatch('SAVE_ENTITY', {
          tableName: 'vendors',
          data: this.data
        })
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('CREATE_ENTITY', {
        tableName: 'vendors',
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
</style>