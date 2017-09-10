<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.details')">

        <form-container name="product">
          <form-row>

            <!--
              Product Name
            -->
            <form-field :label="$t('labels.product_name')" catch-errors="product_name">
              <form-text-input name="product_name"></form-text-input>
            </form-field>

            <!--
              Price
            -->
            <form-field :label="$t('labels.price')" :catch-errors="[ 'price', 'currency' ]">
              <form-inputs-group>

                <!--
                  Amount
                -->
                <form-text-input name="price"></form-text-input>

                <!--
                  Currency
                -->
                <form-dropdown-input name="currency" class="dropdown--small" :placeholder="$t('labels.currency')">
                  <dropdown-option v-for="currency in currencies" :key="currency.id"
                                  :value="currency.id"
                                  :selected.once="currency.id === form.currency">
                    {{ currency.code }}
                  </dropdown-option>
                </form-dropdown-input>

              </form-inputs-group>
            </form-field>

          </form-row>

          <form-row>

            <!--
              Quantity
            -->
            <form-field :label="$t('labels.quantity')">
              <form-text-input name="qty"></form-text-input>
            </form-field>

            <!--
              Tax Rate
            -->
            <form-field :label="$t('labels.tax_rate')">

              <form-dropdown-input name="tax_rate" :placeholder="$t('labels.tax_rate')">
                <dropdown-option v-for         = "taxRate in taxRates"
                                :key           = "taxRate.uuid"
                                :value         = "taxRate.uuid"
                                :selected.once = "taxRate.uuid === form.tax_rate"
                >
                  {{ taxRate.name }}
                </dropdown-option>
              </form-dropdown-input>

            </form-field>

          </form-row>

          <form-row>

            <!--
              Description
            -->
            <form-field :label="$t('labels.description')">
              <form-textarea-input name="description"></form-textarea-input>
            </form-field>

          </form-row>

        </form-container>

      </modal-tab>

      <modal-tab :title="$t('tabs.images')">
        <form-container name="product">
          <form-row>
            <form-field catch-errors="images" :label="$t('labels.images')">

              <form-dropzone-input name="images" class="product-images-upload-field" box multiple>
                <img slot="icon" src="../../../assets/icons/upload.svg">
                <template slot="title">
                  {{ $t('placeholders.upload_product_image') }}
                </template>
                <template slot="subtitle">
                  {{ $t('placeholders.drag_and_drop_image_or_click_to_browse') }}
                </template>
              </form-dropzone-input>

            </form-field>
          </form-row>
        </form-container>
      </modal-tab>
    </modal-tabs>
  </div>
</template>

<script>
export default {
  name: 'edit-product',

  data() {
    return {
      currencies: [
        { id: 1, code: 'EUR' },
        { id: 2, code: 'USD' }
      ],

      taxRates: [
        { name: 'VAT' },
        { name: 'Alcohol Product' },
        { name: 'Tobacco Product' }
      ]
    }
  },

  computed: {
    form() {
      return this.$store.state.form.product
    }
  },

  methods: {
    save() {
      if (this.data.product.key) {
        this.$store.dispatch('SAVE_ENTITY', {
          tableName: 'products',
          data: this.data
        })
      } else {
        this.create()
      }
    },

    create() {
      this.$store.dispatch('CREATE_ENTITY', {
        tableName: 'products',
        data: this.data
      })
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="scss">
.modal-form {
    width: 866px;
}

textarea {
    height: 124px !important;
}
</style>

<style lang="scss">
.product-images-upload-field > .form__input--file-upload {
    height: 287px !important;

    .uploaded-images {
      height: 287px !important;
    }
}
</style>