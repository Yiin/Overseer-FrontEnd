import { fieldMutator } from '@/modules/form/helpers'

export default (formName, fields) => {
  return {
    computed: Object.assign(
      {
        /**
         * Form state
         */
        form() {
          return this.$store.state.form[formName]
        },

        modal() {
          return this.$store.state.modal
        },

        /**
         * Validation errors
         */
        validationErrors() {
          return this.form.validationErrors
        },

        /**
         * Settings state
         */
        settings() {
          return this.$store.state.settings
        },

        /**
         * Static data state
         */
        passive() {
          return this.$store.state.passive
        },

        /**
         * Repositories lists with available items
         */
        countries() {
          return this.$store.getters['documents/repositories/country/ACTIVE_ITEMS']
        },
        languages() {
          return this.$store.getters['documents/repositories/language/ACTIVE_ITEMS']
        },
        industries() {
          return this.$store.getters['documents/repositories/industry/ACTIVE_ITEMS']
        },
        paymentTypes() {
          return this.$store.getters['documents/repositories/paymentType/ACTIVE_ITEMS']
        },
        companySizes() {
          return this.$store.getters['documents/repositories/companySize/ACTIVE_ITEMS']
        },
        currencies() {
          return this.$store.getters['documents/repositories/currency/ACTIVE_ITEMS']
        },
        products() {
          return this.$store.getters['documents/repositories/product/ACTIVE_ITEMS']
        },
        clients() {
          return this.$store.getters['documents/repositories/client/ACTIVE_ITEMS']
        },
        invoices() {
          return this.$store.getters['documents/repositories/invoice/ACTIVE_ITEMS']
        },
        payments() {
          return this.$store.getters['documents/repositories/payment/ACTIVE_ITEMS']
        },
        quotes() {
          return this.$store.getters['documents/repositories/quote/ACTIVE_ITEMS']
        },
        expenses() {
          return this.$store.getters['documents/repositories/expense/ACTIVE_ITEMS']
        },
        vendors() {
          return this.$store.getters['documents/repositories/vendor/ACTIVE_ITEMS']
        },

        /**
         * Dropdown options
         * @return {[type]} [description]
         */
        dropdownOptions() {
          return {
            clients: this.clients.map(this.makeDropdownOptionObj({
              value: 'uuid'
            })),
            invoices: this.invoices.map(this.makeDropdownOptionObj({
              text: 'invoiceNumber',
              value: 'uuid'
            })),
            vendors: this.vendors.map(this.makeDropdownOptionObj({
              text: 'companyName',
              value: 'uuid'
            })),
            countries: this.countries.map(this.makeDropdownOptionObj()),
            languages: this.languages.map(this.makeDropdownOptionObj()),
            paymentTerms: this.passive.paymentTerms.map(this.makeDropdownOptionObj()),
            paymentTypes: this.paymentTypes.map(this.makeDropdownOptionObj()),
            companySizes: this.companySizes.map(this.makeDropdownOptionObj()),
            currencies: this.currencies.map(this.makeDropdownOptionObj({
              text(currency) {
                return `${currency.code} - ${currency.name}`
              }
            })),
            industries: this.industries.map(this.makeDropdownOptionObj()),
            memberStates: this.passive.memberStates.map(this.makeDropdownOptionObj({
              value: 'code'
            })),
            discountTypes: [
              {
                text: this.$t('discount_type.percent'),
                value: 'percentage'
              },
              {
                text: this.$t('discount_type.flat'),
                value: 'flat'
              }
            ]
          }
        },

        /**
         * Read only mode
         */
        preview() {
          return this.form._preview
        }
      },
      computeFields(formName, fields)
    ),

    methods: {
      /**
       * Convert object to dropdown option
       */
      makeDropdownOptionObj({ text = 'name', value = 'id' } = {}) {
        return (item) => {
          return Object.assign({}, item, {
            text: typeof text === 'function' ? text(item) : item[text],
            value: typeof value === 'function' ? value(item) : item[value]
          })
        }
      },

      /**
       * Fill form with random data
       * FOR TESTING PURPOSES ONLY
       */
      fill() {
        this.$store.dispatch(`form/${formName}/FILL`)
      },

      /**
       * Validate form field
       */
      validate(field) {
        this.$store.dispatch(`form/${formName}/VALIDATE`, field)
      },

      /**
       * Save form data to the server
       */
      save() {
        if (this.form.fields.uuid) {
          this.$store.dispatch(`form/${formName}/SAVE`).then(() => {
            this.$store.dispatch('modal/CLOSE')
          })
        } else {
          this.create()
        }
      },

      /**
       * Create new document
       */
      create() {
        if (typeof this.onCreate === 'function') {
          this.onCreate()
        }
        this.$store.dispatch(`form/${formName}/CREATE`).then(() => {
          this.$store.dispatch('modal/CLOSE')
        })
      },

      /**
       * Close the form
       */
      cancel() {
        this.$emit('cancel')
      }
    }
  }
}

function computeFields(formName, fields) {
  const computed = {}

  fields.forEach((field) => {
    if (typeof field === 'string') {
      computed[field] = fieldMutator(formName, field)
    } else {
      computed[field.field] = fieldMutator(formName, field)
    }
  })

  return computed
}
