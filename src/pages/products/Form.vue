<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill">
      <modal-tab :title="$t('tabs.details')">

        <form-row>
          <form-field :errors="validationErrors.name" :label="$t('labels.product_name')">
            <form-text-input v-model="name" name="product_name" :readonly="preview"></form-text-input>
          </form-field>
          <form-currency-dropdown :errors="validationErrors.currency_code" v-model="currency_code" :readonly="preview"></form-currency-dropdown>
        </form-row>

        <form-row>
          <form-field :label="$t('labels.product_type')">
            <form-dropdown-input
              :items="productTypes"
              v-model="is_service"
              :readonly="preview"
            ></form-dropdown-input>
          </form-field>

          <form-field v-show="!is_service" :errors="validationErrors.qty" :label="$t('labels.quantity')">
            <form-text-input
              label="Quantity"
              v-model="qty"
              :readonly="preview"
            ></form-text-input>
          </form-field>
        </form-row>

        <form-row>
          <form-field :errors="validationErrors.price" :label="$t('labels.price')">
            <form-formatted-input
              type="number"
              :label="currency_code"
              v-model="price"
              name="price"
              :readonly="preview"
            ></form-formatted-input>
          </form-field>

          <form-field :label="$t('labels.identification_number')">
            <form-text-input
              v-model="identification_number"
              name="identification_number"
              :readonly="preview"
            ></form-text-input>
          </form-field>

        </form-row>

        <form-row>
          <form-field :label="$t('labels.description')">
            <form-textarea-input
              label="Description"
              v-model="description"
              :readonly="preview"
            ></form-textarea-input>
          </form-field>
        </form-row>

      </modal-tab>

      <modal-tab :title="$t('tabs.images')">
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12>
              <form-images-input name="images" class="product-images-upload-field" box multiple>
                <img slot="icon" src="../../assets/icons/image.svg">
                <template slot="title">
                  {{ $t('placeholders.upload_product_images') }}
                </template>
                <template slot="subtitle">
                  {{ $t('placeholders.drag_and_drop_image_or_click_to_browse') }}
                </template>
              </form-images-input>
            </v-flex>
          </v-layout>
        </v-container>
      </modal-tab>
    </modal-tabs>
  </div>
</template>

<script>
import FormMixin from '@/mixins/FormMixin'
import FormFormattedInput from '@/components/common/Form/FormFormattedInput.vue'
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'

export default {
  mixins: [
    FormMixin('product', [
      /**
       * Fields
       */
      'name',
      'identification_number',
      'is_service',
      'qty',
      'price',
      'currency_code',
      'description'
    ])
  ],

  components: {
    FormFormattedInput,
    FormCurrencyDropdown
  },

  computed: {
    productTypes() {
      return [
        { text: 'Physical', value: false },
        { text: 'Service', value: true }
      ]
    }
  },

  watch: {
    is_service(isService) {
      if (isService) {
        this.qty = null
      } else {
        this.qty = 1
      }
    }
  },

  mounted() {
    if (!this.form.fields.uuid) {
      this.currency_code = this.settings.currency.code
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
}
.modal-tab {
  height: 400px;
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