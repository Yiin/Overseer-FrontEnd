<template>
  <div class="modal-form">
    <modal-tabs @save="save" @cancel="cancel">
      <modal-tab title="Details">
        <div class="form">
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Product Name</label>
              <input v-model="name" class="form__input" type="text" name="product_name">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Price</label>
              <input v-model="price" class="form__input" type="text" name="price">
            </div>
            <div class="form__input-wrapper">
              <label>Currency</label>
              <dropdown v-model="currency" placeholder="Currency">
                <dropdown-option v-for="c in currencies"
                                 :key="c.code"
                                 :value="c.code"
                                 :selected.once="c.code === currency">
                  {{ c.code }}
                </dropdown-option>
              </dropdown>
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Quantity</label>
              <input v-model="qty" class="form__input" type="text" name="qty">
            </div>
            <div class="form__input-wrapper">
              <label>Tax Rate</label>
              <dropdown v-model="taxRate" placeholder="Tax Rate">
                <dropdown-option v-for="tR in taxRates"
                                 :key="tR.name"
                                 :value="tR.name"
                                 :selected.once="tR.name === taxRate">
                  {{ tR.name }}
                </dropdown-option>
              </dropdown>
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Description</label>
              <textarea v-model="description" class="form__input"></textarea>
            </div>
          </div>
        </div>
      </modal-tab>
    </modal-tabs>
  </div>
</template>

<script>
export default {
  name: 'edit-product',

  props: {
    data: {
      default: () => {
        return {}
      }
    }
  },

  data() {
    const current = this.data.product

    return {
      currencies: [
        { code: 'EUR' },
        { code: 'USD' }
      ],

      taxRates: [
        { name: 'VAT' },
        { name: 'Alcohol Product' },
        { name: 'Tobacco Product' }
      ],

      name: current.name,
      price: current.price,
      qty: current.qty,
      currency: current.currency,
      taxRate: current.taxRate,
      description: current.description
    }
  },

  watch: {
    name: function (val) {
      this.data.product.name = val
    },
    price: function (val) {
      this.data.product.price = val
    },
    qty: function (val) {
      this.data.product.qty = val
    },
    currency: function (val) {
      this.data.product.currency = val
    },
    taxRate: function (val) {
      this.data.product.taxRate = val
    },
    description: function (val) {
      this.data.product.description = val
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

<style lang="scss">
.modal-form {
    width: 866px;
}
</style>