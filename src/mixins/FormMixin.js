import moment from 'moment'
import { fieldMutator } from '@/modules/form/helpers'
import { getRepositoryName } from '@/modules/documents/helpers'

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

        currentDocument() {
          if (!this.form.fields.uuid) {
            return null
          }

          const repositoryName = getRepositoryName(formName)

          return this.$store.getters[`documents/repositories/${repositoryName}/FIND_ITEM_BY_KEY`](this.form.fields.uuid)
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
          return this.$store.getters['documents/repositories/product/ACTIVE_COMPANY_ITEMS']
        },
        clients() {
          return this.$store.getters['documents/repositories/client/ACTIVE_COMPANY_ITEMS']
        },
        invoices() {
          return this.$store.getters['documents/repositories/invoice/ACTIVE_COMPANY_ITEMS']
        },
        payments() {
          return this.$store.getters['documents/repositories/payment/ACTIVE_COMPANY_ITEMS']
        },
        credits() {
          return this.$store.getters['documents/repositories/credit/ACTIVE_COMPANY_ITEMS']
        },
        quotes() {
          return this.$store.getters['documents/repositories/quote/ACTIVE_COMPANY_ITEMS']
        },
        expenses() {
          return this.$store.getters['documents/repositories/expense/ACTIVE_COMPANY_ITEMS']
        },
        vendors() {
          return this.$store.getters['documents/repositories/vendor/ACTIVE_COMPANY_ITEMS']
        },
        employees() {
          return this.$store.getters['documents/repositories/employee/ACTIVE_COMPANY_ITEMS']
        },
        projects() {
          return this.$store.getters['documents/repositories/project/ACTIVE_COMPANY_ITEMS']
        },

        /**
         * Dropdown options
         * @return {[type]} [description]
         */
        dropdownOptions() {
          return {
            products: this.products.map(this.makeDropdownOptionMapper({
              text: 'name',
              value: 'uuid'
            })).sort(this.sortByText),

            clients: this.clients.map(this.makeDropdownOptionMapper({
              text: 'name',
              value: 'uuid'
            })).sort(this.sortByText),

            invoices: this.invoices.map(this.makeDropdownOptionMapper({
              text: 'invoiceNumber',
              value: 'uuid'
            })).sort(this.sortByText),

            payments: this.payments.map(this.makeDropdownOptionMapper({
              text(payment) {
                return payment.getDescriptiveTitle()
              },
              value: 'uuid'
            })).sort(this.sortByText),

            credits: this.credits.map(this.makeDropdownOptionMapper({
              text(credit) {
                return credit.getTitle()
              },
              value: 'uuid'
            })).sort(this.sortByText),

            quotes: this.quotes.map(this.makeDropdownOptionMapper({
              text(quote) {
                return quote.getDescriptiveTitle()
              },
              value: 'uuid'
            })).sort(this.sortByText),

            expenses: this.expenses.map(this.makeDropdownOptionMapper({
              text(credit) {
                return credit.getDescriptiveTitle()
              },
              value: 'uuid'
            })).sort(this.sortByText),

            vendors: this.vendors.map(this.makeDropdownOptionMapper({
              text: 'name',
              value: 'uuid'
            })).sort(this.sortByText),

            employees: this.employees.map(this.makeDropdownOptionMapper({
              text(employee) {
                return employee.getTitle()
              },
              value: 'uuid'
            })).sort(this.sortByText),

            projects: this.projects.map(this.makeDropdownOptionMapper({
              text: 'name',
              value: 'uuid'
            })).sort(this.sortByText),

            countries: this.countries.map(this.makeDropdownOptionMapper()).sort(this.sortByText),
            languages: this.languages.map(this.makeDropdownOptionMapper()).sort(this.sortByText),
            paymentTerms: this.passive.paymentTerms.map(this.makeDropdownOptionMapper()).sort(this.sortByText),
            paymentTypes: this.paymentTypes.map(this.makeDropdownOptionMapper()).sort(this.sortByText),
            companySizes: this.companySizes.map(this.makeDropdownOptionMapper()).sort(this.sortByText),
            currencies: this.currencies.map(this.makeDropdownOptionMapper({
              text(currency) {
                return `${currency.code} - ${currency.name}`
              }
            })).sort(this.sortByText),
            industries: this.industries.map(this.makeDropdownOptionMapper()).sort(this.sortByText),
            memberStates: this.passive.memberStates.map(this.makeDropdownOptionMapper({
              value: 'code'
            })).sort(this.sortByText),
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
            this.$store.commit(`form/${formName}/SET_FIELD_VALUE`, {
              field: 'due_date',
              value
            })
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

    mounted() {
      /**
       * Set default currency if needed
       */
      if (!this.form.fields.uuid) {
        if (typeof this.currency_code !== 'undefined') {
          if (!this.currency_code) {
            this.currency_code = this.settings.currency.code
          }
        }
      }
    },

    methods: {
      sortByText(a, b) {
        const cmpA = a.text.toLowerCase()
        const cmpB = b.text.toLowerCase()
        if (cmpA < cmpB) {
          return -1
        }
        if (cmpA > cmpB) {
          return 1
        }
        return 0
      },

      /**
       * Convert object to dropdown option
       */
      makeDropdownOptionMapper({ text = 'name', value = 'id' } = {}) {
        return (item) => {
          return Object.assign(Object.create(item), {
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
          if (this.form.activity) {
            this.restore()
            return
          }
          this.$store.dispatch(`form/${formName}/SAVE`).then((response) => {
            if (response && response.ok === false) {
              return response
            }
            this.close()
          })
        } else {
          this.create()
        }
      },

      /**
       * Restore this document version
       */
      restore() {
        this.$store.dispatch(`form/${formName}/RESTORE`).then((response) => {
          if (response && response.ok === false) {
            return response
          }
          this.close()
        })
      },

      /**
       * Create new document
       */
      create() {
        if (typeof this.onCreate === 'function') {
          this.onCreate()
        }
        this.$store.dispatch(`form/${formName}/CREATE`).then((response) => {
          if (response && response.ok === false) {
            return response
          }
          this.close()
        })
      },

      /**
       * Close the form
       */
      close() {
        this.cancel()
      },

      // ^ alias
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
