import { id, text, float } from '@/modules/documents/transformers/data-types'
import store from '@/store'

// console.log('store', store)

export default {
  name: 'product',

  data: {
    /**
     * Product Name
     */
    name: {
      type: text,
      default: '',

      modal: {
        tabIndex: 0
      }
    },

    /**
     * Price
     */
    price: {
      type: float,
      default: 0,

      modal: {
        tabIndex: 0
      }
    },

    /**
     * Currency
     */
    currencyId: {
      name: 'currency_id',
      type: id,
      default: () => store.state.settings.currency.id,

      modal: {
        tabIndex: 0
      }
    },

    /**
     * Qantity
     */
    qty: {
      type: float,
      default: 0,

      modal: {
        tabIndex: 0
      }
    },

    /**
     * Is product a service?
     * Services has no quantity
     */
    is_service: {
      ignore: true,

      modal: {
        tabIndex: 0
      }
    },

    /**
     * Tax rate that should be applied to product.
     */
    taxRateUuid: {
      name: 'tax_rate_uuid',

      modal: {
        tabIndex: 0
      }
    },

    /**
     * Item description
     */
    description: {
      type: text,
      default: '',

      modal: {
        tabIndex: 0
      }
    },
    identificationNumber: {
      name: 'identification_number',
      type: 'string',
      default: '',

      modal: {
        tabIndex: 0
      }
    }
  }
}
