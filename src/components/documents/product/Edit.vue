<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill">
      <modal-tab :title="$t('tabs.details')">

        <form-row>
          <form-field catch-errors="name" :label="$t('labels.product_name')">
            <form-text-input v-model="name" name="product_name" :readonly="preview"></form-text-input>
          </form-field>
          <form-field catch-errors="identification_number" :label="$t('labels.identification_number')">
            <form-text-input v-model="identification_number" name="identification_number" :readonly="preview"></form-text-input>
          </form-field>
        </form-row>

        <form-row>
          <form-field :label="$t('labels.product_type')">
            <form-dropdown-input
              :items="productTypes"
              v-model="isService"
            >
              <dropdown-option :value="false">
                Physical
              </dropdown-option>
              <dropdown-option :value="true">
                Service
              </dropdown-option>
            </form-dropdown-input>
          </form-field>

          <form-field :label="$t('labels.quantity')">
            <form-text-input
              label="Quantity"
              v-model="qty"
            ></form-text-input>
          </form-field>
        </form-row>

        <form-row>
          <form-field :label="$t('labels.price')">
            <form-text-input
              label="Price"
              name="price"
              v-model="price"
            ></form-text-input>
          </form-field>

          <form-currency-dropdown v-model="currency_code" :readonly="preview"></form-currency-dropdown>
        </form-row>

        <form-row>
          <form-field :label="$t('labels.description')">
            <form-textarea-input
              label="Description"
              v-model="description"
            ></form-textarea-input>
          </form-field>
        </form-row>

      </modal-tab>

      <modal-tab :title="$t('tabs.images')">
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12>
              <form-images-input name="images" class="product-images-upload-field" box multiple>
                <img slot="icon" src="../../../assets/icons/image.svg">
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
import FormCurrencyDropdown from '@/components/form/CurrencyDropdown.vue'

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

  components: {
    FormCurrencyDropdown
  },

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