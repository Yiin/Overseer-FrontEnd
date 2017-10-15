<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel" @fill="fill">
      <modal-tab :title="$t('tabs.details')">

        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                :label="$t('labels.product_name')"
                name="product_name"
                v-model="name"
                @change="validate('name')"
                :error-messages="validationErrors.name"
                data-lpignore="true"
                tabindex="1"
              ></v-text-field>

              <v-text-field
                :label="$t('labels.product_name')"
                name="product_name"
                v-model="name"
                @change="validate('name')"
                :error-messages="validationErrors.name"
                data-lpignore="true"
                tabindex="1"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>

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
import FormMixin from '@/mixins/FormMixin'

export default {
  mixins: [
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
  ]
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