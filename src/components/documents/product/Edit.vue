<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab :title="$t('tabs.details')">

        <form-container name="product">
          <form-row>

            <!--
              Product Name
            -->
            <form-field :label="$t('labels.product_name')" catch-errors="name">
              <form-text-input v-model="form.name" name="name"></form-text-input>
            </form-field>

            <!--
              Price
            -->
            <form-field :label="$t('labels.price')" :catch-errors="[ 'price', 'currency_id' ]">
              <form-inputs-group>

                <!--
                  Amount
                -->
                <form-text-input v-model="form.price" name="price"></form-text-input>

                <!--
                  Currency
                -->
                <form-dropdown-input v-model="form.currency_id" name="currency_id" class="dropdown--small" :placeholder="$t('labels.currency')" scrollable searchable>
                  <dropdown-option v-for="currency in passive.currencies" :key="currency.id"
                                  :value="currency.id"
                                  :selected="currency.id === form.currency_id">
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
            <form-field catch-errors="qty" :label="$t('labels.quantity')">
              <form-text-input v-model="form.qty" name="qty"></form-text-input>
            </form-field>

            <!--
              Tax Rate
            -->
            <form-field catch-errors="tax_rate_uuid" :label="$t('labels.tax_rate')">

              <form-dropdown-input v-model="form.tax_rate_uuid" name="tax_rate_uuid" scrollable searchable>
                <dropdown-option v-for         = "taxRate in taxRates"
                                :key           = "taxRate.uuid"
                                :value         = "taxRate.uuid"
                                :selected.once = "taxRate.uuid === form.tax_rate_uuid"
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
              <form-textarea-input v-model="form.description" name="description"></form-textarea-input>
            </form-field>

          </form-row>

        </form-container>

      </modal-tab>

      <modal-tab :title="$t('tabs.images')">
        <form-container name="product">
          <form-row>
            <form-field catch-errors="images" :label="$t('labels.images')">

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
export default {
  name: 'edit-product',

  props: {
    data: {
      default: null
    }
  },

  computed: {
    form() {
      return this.$store.state.form.product
    },

    passive() {
      return this.$store.state.passive
    },

    taxRates() {
      return this.$store.state.table.tax_rates.items
    }
  },

  methods: {
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