import { id, text } from './data-types'
import ValidationRules from './modules/form/validation/rules'

export default {
  name: 'client',
  table: 'clients',

  data: {
    /**
     * Name of the client.
     */
    name: {
      type: text,
      default: '',

      form: {
        type: 'string',
        validation: [
          ValidationRules.REQUIRED
        ]
      }
    },

    /**
     * Registration number
     */
    registrationNumber: {
      name: 'registration_number',
      type: text,
      default: '',

      form: {
        type: 'string'
      }
    },
    vatNumber: {
      name: 'vat_number',
      type: text,
      default: ''
    },
    website: {
      type: text,
      default: ''
    },
    phone: {
      type: text,
      default: ''
    },

    address1: {
      type: text,
      default: ''
    },
    address2: {
      type: text,
      default: ''
    },
    city: {
      type: text,
      default: ''
    },
    postal_code: {
      type: text,
      default: ''
    },
    state: {
      type: text,
      default: ''
    },
    country_id: {
      type: id,
      default: null
    },

    contacts: {
      type: client.contacts.map((contact) => clientContact(contact))
    },

    currency_id: {
      type: id,
      default: null
    },
    language_id: {
      type: id,
      default: null
    },
    payment_terms: {
      type: id,
      default: null
    },
    company_size_id: {
      type: id,
      default: null
    },
    industry_id: {
      type: id,
      default: null
    }
  }
}
