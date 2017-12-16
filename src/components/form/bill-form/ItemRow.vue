<template lang="pug">
  tr

    //-
      Select or enter product or serice

    th.field.field--itemName

      //-
        List of products/services

      form-dropdown-input(
        :items='products'
        v-model='productUuid'
        :top='36'
        searchable
      )

        //-
          Custom input

        input(
          slot='activator'
          slot-scope='{ parent }'
          type='text'
          v-model='item.name'
          @input='parent.input($event.target.value)'
          @blur='parent.onBlur'
          @focus='parent.onFocus'
        )

    //-
      Quantity

    th.field.field--itemQty
      input(type='text' v-model='qty')

    //-
      Price

    th.field.field--itemPrice
      vue-numeric(
        type='text'
        :precision='2'
        :currency='currency.symbol'
        separator=','
        v-model='cost'
      )

    //-
      Discount

      Either percentage or flat value. Can't be both

    th.field.field--itemDiscount

      //-
        Percentage discount input

      vue-numeric(
        type='text'
        :precision='2'
        currency-symbol-position='suffix'
        currency='%'
        separator=','
        v-model='discountPercentage'
      )

      //-
        Flat discount input

      vue-numeric(
        type='text'
        :precision='2'
        :currency='currency.symbol'
        separator=','
        v-model='discountAmount'
      )

    //-
      sum = price * qty - discount

    th.field.field--itemAmount
      input(type='text' v-model='amount' readonly)

      //-
        A button to remove this items

      .button--removeRow(v-if='!isLast' @click='removeSelf')

</template>

<script>
import VueNumeric from 'vue-numeric'
import Money from '@models/money'
import BillItem from '@models/bill-item'

export default {
  components: {
    VueNumeric
  },

  props: {
    item: {
      type: BillItem,
      required: true
    },

    currency: {
      required: true
    },

    isLast: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      productUuid: (this.item.product || null) && this.item.product.uuid,
      cost: this.item.cost.get(),
      qty: this.item.qty,
      discountPercentage: this.item.discount.type === 'percentage' ? this.item.discount.amount : 0,
      discountAmount: this.item.discount.type === 'flat' ? this.item.discount.amount : 0
    }
  },

  computed: {
    products() {
      return this.$repository('products').activeCompanyItems.map((product) => ({
        text: product.name,
        value: product.uuid
      }))
    },

    amount: {
      get() {
        return this.currency.symbol + ' ' + Money.formatNumber(this.item.getFinalPrice())
      },
      set() {}
    }
  },

  watch: {
    productUuid(uuid) {
      if (!uuid) {
        return
      }
      const product = this.$repository('products').find(uuid)

      if (!product) {
        return
      }

      this.item.product = product
      this.item.name = product.name
      this.qty = 1
      this.cost = product.price.getIn(this.item.currency)
    },

    qty(qty) {
      qty = parseFloat(qty)

      if (Number.isNaN(qty)) {
        this.item.qty = 0
      } else {
        this.item.qty = qty
      }
    },

    cost(cost) {
      if (Number.isNaN(parseFloat(cost))) {
        this.item.cost.set(0)
      } else {
        this.item.cost.set(cost)
      }
    },

    discountAmount(discount) {
      if (this.discountPercentage) {
        this.discountPercentage = 0
      }
      this.item.discount.type = 'flat'
      this.item.discount.value = discount
    },

    discountPercentage(discount) {
      if (this.discountAmount) {
        this.discountAmount = 0
      }
      this.item.discount.type = 'percentage'
      this.item.discount.value = discount
    },

    item: {
      handler(item) {
        const productUuid = (item.product || null) && item.product.uuid
        const cost = item.cost.get()
        const qty = item.qty

        if (this.productUuid !== productUuid) {
          this.productUuid = productUuid
        }
        if (this.cost !== cost) {
          this.cost = cost
        }
        if (this.qty !== qty) {
          this.qty = qty
        }
      },
      deep: true
    }
  },

  methods: {
    removeSelf() {
      this.$emit('remove')
    }
  }
}
</script>