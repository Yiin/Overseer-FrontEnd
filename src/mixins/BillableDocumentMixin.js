import BillItemsList from '@/components/form/BillItemsList.vue'
import BillItemForm from '@/components/form/BillItemForm.vue'
import moment from 'moment'

export default {
  components: {
    BillItemsList,
    BillItemForm
  },

  data() {
    return {
      addItemForm: false
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
    },

    client() {
      return this.clients.find((client) => client.uuid === this.client_uuid)
    },

    due_date: {
      get() {
        // if document is already created, leave due date as it is
        if (this.form.fields.uuid) {
          return this.form.fields.due_date
        }

        // else set due date by client's payment terms
        const client = this.clients.find((client) => client.uuid === this.client_uuid)

        if (client) {
          if (client.paymentTerms !== null) {
            return moment(this.invoice_date).add(client.paymentTerms, 'days')
          }
        }
        return null
      },

      set(value) {
        this.$store.commit(`form/invoice/SET_FIELD_VALUE`, {
          field: 'due_date',
          value
        })
      }
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
