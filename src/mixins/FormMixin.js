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
         * Read only mode
         */
        preview() {
          return this.form.__preview
        }
      },
      computeFields(formName, fields)
    ),

    methods: {
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
          this.$store.dispatch(`form/${formName}/SAVE`)
        } else {
          this.create()
        }
      },

      /**
       * Create new document
       */
      create() {
        this.$store.dispatch(`form/${formName}/CREATE`)
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
