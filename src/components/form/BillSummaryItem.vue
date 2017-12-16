<template>
  <div class="bill-summary__item">
    <div class="bill-summary__item-header">
      <span class="bill-summary__item-title">
        {{ item.name || item.product.name }}
      </span>
      <span class="bill-summary__item-sub-title">
        {{ item.cost.currency.symbol }} {{ item.cost.get() | currency }} x {{ item.qty }}
      </span>
    </div>
    <div class="bill-summary__item-price">
      <span class="currency">€</span>
      <span class="currency currency--primary">
        {{ item.cost.get() * item.qty | currency }}
      </span>
    </div>
  </div>
</template>

<script>
// import BillItem from '@models/bill-item'

export default {
  props: {
    /**
     * Item to display summary of
     */
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    /**
     * Title of the item
     */
    title() {
      return this.item.name
    },

    date() {
      const months = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'
      ]
      const date = this.item.date

      const day = date.getDate()
      const month = date.getMonth()
      const year = date.getFullYear()

      return `${day} ${months[month]}, ${year}`
    }
  }
}
</script>