<template lang="pug">
  tr.itemRow

    //-
      Select or enter product or serice

    td.field.field--itemName

      .itemName {{ name }}

      //-
        List of products/services

        form-dropdown-input(
          :items='products'
          v-model='productUuid'
          :top='38'
          searchable
        )

        //-
          Custom input

          input.itemName(
            slot='activator'
            slot-scope='{ parent }'
            placeholder='Enter or select item'
            type='text'
            :class='{ empty: !name }'
            v-model='name'
            @input='parent.input($event.target.value)'
            @blur='parent.onBlur'
            @focus='parent.onFocus'
          )

    //-
      Quantity
      input(type='text' v-model='qty')

    td.field.field--itemQty {{ qty }}

    //-
      Price
      vue-numeric(
        type='text'
        :precision='2'
        :currency='currency.symbol'
        separator=','
        v-model='cost'
      )

    td.field.field--itemPrice {{ costFormatted }}

    //-
      Discount

      Either percentage or flat value. Can't be both

      td.field.field--itemDiscount

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
      input(type='text' v-model='amount' readonly)

    td.field.field--itemAmount {{ amountFormatted }}

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
      name: this.item.name,
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

    costFormatted() {
      return this.currency.symbol + ' ' + Money.formatNumber(this.cost)
    },

    amountFormatted() {
      return this.currency.symbol + ' ' + Money.formatNumber(this.amount)
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

    name(name) {
      if (!name) {
        this.productUuid = null
      }
      this.item.name = name
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
        const name = item.name
        const cost = item.cost.get()
        const qty = item.qty

        if (this.productUuid !== productUuid) {
          this.productUuid = productUuid
        }
        if (this.name !== name) {
          this.name = name
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