<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill">
      <modal-tab :title="$t('tabs.details')">

        <div class="form__row">
          <div class="form__column form__column--half">
              <v-text-field
                :label="$t('labels.product_name')"
                name="product_name"
                v-model="name"
                @change="validate('name')"
                :error-messages="validationErrors.name"
                tabindex="1"
              ></v-text-field>
          </div>
          <div class="form__column form__column--half">
            <v-text-field
              :label="$t('labels.identification_number')"
              name="identification_number"
              v-model="identification_number"
              tabindex="2"
            ></v-text-field>
          </div>
        </div>
        <div class="form__row">
          <div class="form__column form__column--half">
            <v-select
              label="Product Type"
              :items="productTypes"
              v-model="isService"
              persistent-hint
            ></v-select>

            <v-text-field
              label="Quantity"
              v-model="qty"
            ></v-text-field>
          </div>

          <div class="form__column form__column--half">
            <v-text-field
              label="Price"
              name="price"
              v-model="price"
            ></v-text-field>

            <v-select
              label="Currency"
              :items="currencies"
              v-model="currency_code"
              autocomplete
            ></v-select>
          </div>
        </div>

        <v-text-field
          label="Description"
          multi-line
          v-model="description"
        ></v-text-field>

      </modal-tab>

      <modal-tab :title="$t('tabs.images')">
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12>
              <form-images-input name="images" class="product-images-upload-field" box multiple>
                <img slot="icon" src="../../../assets/icons/upload.svg">
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
import CurrencyMixin from '@/mixins/CurrencyMixin'

export default {
  mixins: [
    CurrencyMixin,
    FormMixin('product', [
      /**
       * Fields
       */
      'name',
      'identification_number',
      'qty',
      'price',
      'currency_code',
      'description'
    ])
  ],

  computed: {
    isService: {
      set(value) {
        this.$store.commit('form/product/IS_SERVICE', value)
      },
      get() {
        return this.form.is_service
      }
    },

    productTypes() {
      return [
        { text: 'Physical', value: false },
        { text: 'Service', value: true }
      ]
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