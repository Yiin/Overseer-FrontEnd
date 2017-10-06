<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill" :hide-buttons="preview">
      <modal-tab :title="$t('tabs.details')">

        <form-container name="product">
          <form-row>

            <!--
              Product Name
            -->
            <form-field :label="$t('labels.product_name')" catch-errors="name">
              <form-text-input v-model="form.name" name="name" :readonly="preview"></form-text-input>
            </form-field>

            <form-field :label="$t('labels.identification_number')">
              <form-inputs-group>
                <form-text-input v-model="form.identification_number" name="identification_number" :readonly="preview"></form-text-input>

                <!--
                  Tax Rate
                -->
                <form-field catch-errors="tax_rate_uuid" :label="$t('labels.tax_rate')">

                  <form-dropdown-input v-model="form.tax_rate_uuid" name="tax_rate_uuid" scrollable searchable :readonly="preview">
                    <dropdown-option v-for         = "taxRate in taxRates"
                                    :key           = "taxRate.uuid"
                                    :value         = "taxRate.uuid"
                                    :selected.once = "taxRate.uuid === form.tax_rate_uuid"
                    >
                      {{ taxRate.name }}
                    </dropdown-option>
                  </form-dropdown-input>

                </form-field>

              </form-inputs-group>

            </form-field>

          </form-row>

          <form-row>

            <!--
              Quantity
            -->
            <form-field catch-errors="is_service" :label="$t('labels.product_type')">
              <form-inputs-group>
                <form-dropdown-input v-model="form.is_service" name="is_service" class="--service-dropdown">
                  <dropdown-option :value="false" :selected="!form.is_service">
                    Physical
                  </dropdown-option>
                  <dropdown-option :value="true" :selected="form.is_service">
                    Service
                  </dropdown-option>
                </form-dropdown-input>

                <form-field v-if="!form.is_service" catch-errors="qty" :label="$t('labels.quantity')">
                  <form-text-input v-model="form.qty" name="qty" :readonly="preview"></form-text-input>
                </form-field>
              </form-inputs-group>
            </form-field>

            <!--
              Price
            -->
            <form-field :label="$t('labels.price')" :catch-errors="[ 'price', 'currency_id' ]">
              <form-inputs-group>

                <!--
                  Amount
                -->
                <form-formatted-input
                  type="number"
                  :label="currencyCode"
                  v-model="form.price"
                  name="price"
                  :readonly="preview"
                ></form-formatted-input>

                <!--
                  Currency
                -->
                <form-currency-dropdown v-model="form.currency_id" class="dropdown--small" :readonly="preview"></form-currency-dropdown>

              </form-inputs-group>
            </form-field>

          </form-row>

          <form-row>

            <!--
              Description
            -->
            <form-field :label="$t('labels.description')">
              <form-textarea-input v-model="form.description" name="description" :readonly="preview"></form-textarea-input>
            </form-field>

          </form-row>

        </form-container>

      </modal-tab>

      <modal-tab :title="$t('tabs.images')" class="product__images">
        <form-container name="product">
          <form-row>
            <form-field catch-errors="images">

              <form-images-input name="images" class="product-images-upload-field" box multiple>
                <img slot="icon" src="../../../assets/icons/upload.svg">
                <template slot="title">
                  {{ $t('placeholders.upload_product_image') }}
                </template>
                <template slot="subtitle">
                  {{ $t('placeholders.drag_and_drop_image_or_click_to_browse') }}
                </template>
              </form-images-input>

            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
    </modal-tabs>
  </div>
</template>

<script>
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'

export default {
  name: 'edit-product',

  components: {
    FormCurrencyDropdown,
    FormFormattedInput
  },

  props: {
    data: {
      default: null
    }
  },

  computed: {
    form() {
      return this.$store.state.form.product
    },

    currency() {
      let currency = null

      if (this.form.currency_id) {
        currency = this.passive.currencies.find((c) => c.id === this.form.currency_id)
      }
      if (!currency) {
        currency = this.$store.state.settings.currency
      }
      return currency
    },

    currencyCode() {
      if (this.currency) {
        return this.currency.code
      }
      return 'EUR'
    },

    preview() {
      return this.form.__preview
    },

    settings() {
      return this.$store.state.settings
    },

    passive() {
      return this.$store.state.passive
    },

    taxRates() {
      return this.$store.state.table.tax_rates.items
    }
  },

  methods: {
    fill() {
      this.$store.dispatch('form/product/FILL')
    },

    save() {
      if (this.form.uuid) {
        this.$store.dispatch('form/product/SAVE')
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('form/product/CREATE')
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="scss">
.--service-dropdown {
  width: 100%;
}
.modal-form {
    width: 866px;
    height: 530px;
}
textarea {
    height: 124px !important;
}
.product__images {
  padding-bottom: 20px;
  position: relative;
  height: 332px;
  .form__inline-inputs:last-child {
    margin: 0;
  }
  .form {
    height: 312px;
    padding-bottom: 19px;
    position: absolute;
    width: 100%;
    top: -19px;
  }
}
</style>

<style lang="scss">
.product-images-upload-field > .form__input--file-upload {
    height: 311px !important;

    .uploaded-images {
      height: 311px !important;
    }
}
</style>