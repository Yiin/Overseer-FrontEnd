export default {
  data() {
    return {
      itemModel: {
        product: {},
        product_name: '',
        qty: 1,
        cost: 0,
        discount: 0,
        tax_rate: null
      }
    }
  },

  computed: {
    currency() {
      let currency = null

      // use invoices set currency if possible
      if (this.currency_code) {
        currency = this.currencies.find((c) => c.code === this.currency_code)
      }

      // else try to use clients currency
      if (!currency) {
        const client = this.form.fields.client || this.clients.find((c) => c.uuid === this.client_uuid)

        if (client) {
          currency = client.currency
        }
      }

      // or use users preferred currency
      if (!currency) {
        currency = this.$store.state.settings.currency
      }

      // or just default to eur
      if (!currency) {
        currency = {
          code: 'EUR',
          symbol: '€'
        }
      }
      return currency
    },

    subtotal() {
      return this.items.filter((item) => item.cost)
        .map((item) => {
          return parseFloat(item.cost) * parseFloat(item.qty || 1)
        })
        .reduce((a, b) => a + b, 0)
    },

    discount() {
      return this.items
        .map((item) => {
          const priceSum = parseFloat(item.cost) * parseFloat(item.qty || 1)
          return priceSum * (parseFloat(item.discount) || 0) / 100
        })
        .reduce((a, b) => a + b, 0)
    },

    taxes() {
      const items = this.items
      let taxes = 0 // flat

      for (let i = 0; i < items.length; ++i) {
        if (!items[i].tax_rate) {
          continue
        }

        const tax = this.taxRates.find((taxRate) => taxRate.uuid === items[i].tax_rate.uuid)

        if (!tax) {
          continue
        }

        taxes += parseFloat(tax.rate) * parseFloat(items[i].cost) * (parseFloat(items[i].discount) / 100) / 100
      }
      return taxes
    }
  },

  methods: {
    itemsListProductChange(product) {
      if (!product) {
        return
      }
      if (product.custom) {
        this.$refs.itemsList.setItemAttribute('product_name', product.value)
      } else {
        this.$refs.itemsList.setItemAttribute('product_name', product.name)
        this.$refs.itemsList.setItemAttribute('cost', product.price)
      }
    }
  }
}
