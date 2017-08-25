<template>
  <div class="modal-form">
    <modal-tabs>
      <modal-tab title="About">
        <div class="form">
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Product Name</label>
              <input class="form__input" type="text" name="product_name">
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Price</label>
              <input class="form__input" type="text" name="price">
            </div>
            <div class="form__input-wrapper">
              <label>Currency</label>
              <dropdown placeholder="Hello motherfucker">
                <dropdown-option v-for="currency in currencies" :key="currency.code" :value="currency.code" selected>
                  {{ currency.code }}
                </dropdown-option>
              </dropdown>
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Quantity</label>
              <input class="form__input" type="text" name="qty">
            </div>
            <div class="form__input-wrapper">
              <label>Tax Rate</label>
              <dropdown>
                <dropdown-option v-for="taxRate in taxRates" :key="taxRate.name" :value="taxRate.name" selected>
                  {{ taxRate.name }}
                </dropdown-option>
              </dropdown>
            </div>
          </div>
          <div class="form__inline-inputs">
            <div class="form__input-wrapper">
              <label>Description</label>
              <textarea class="form__input"></textarea>
            </div>
          </div>
          <div class="modal-buttons">
            <div class="modal-buttons-group modal-buttons-group--left">
              <div class="modal-button modal-button__back"><</div>
              <div class="modal-button modal-button__cancel">Cancel</div>
            </div>
            <div class="modal-buttons-group modal-buttons-group--right">
              <div class="modal-button modal-button__save">Save</div>
              <div class="modal-button modal-button__next">Next ></div>
            </div>
          </div>
        </div>
      </modal-tab>
      <modal-tab title="About Us">
        <h1>About Us</h1>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
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
        { code: 'EUR' },
        { code: 'USD' }
      ],

      taxRates: [
        { name: 'VAT' },
        { name: 'Alcohol Product' },
        { name: 'Tobacco Product' }
      ]
    }
  }
}
</script>

<style lang="scss">
.modal-form {
    width: 866px;
}
</style>