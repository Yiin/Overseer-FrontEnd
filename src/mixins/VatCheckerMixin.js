import moment from 'moment'

export default {
  data() {
    return {
      vat_checker: {
        country_code: '',
        number: ''
      }
    }
  },

  watch: {
    'vat_checker.number': function (number) {
      const cc = number.slice(0, 2).toUpperCase()
      const memberState = this.passive.memberStates.find((state) => state.code.toUpperCase() === cc)

      if (memberState) {
        this.vat_checker.country_code = cc
        this.vat_checker.number = number.slice(2)
      }
    }
  },

  computed: {
    /**
     * Static data state
     */
    passive() {
      return this.$store.state.passive
    },

    dropdownOptions() {
      return {
        memberStates: this.passive.memberStates.map(this.makeDropdownOptionObj({
          value: 'code'
        })).sort(this.sortByText)
      }
    },

    vatCheckerResults() {
      return this.$store.state.features.vat_checker.results.map((result) => {
        result.checked_time_ago = moment(result.created_at).fromNow()
        return result
      })
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
    makeDropdownOptionObj({ text = 'name', value = 'id' } = {}) {
      return (item) => {
        return Object.assign({}, item, {
          text: typeof text === 'function' ? text(item) : item[text],
          value: typeof value === 'function' ? value(item) : item[value]
        })
      }
    },

    checkVat() {
      this.$store.dispatch('features/vat_checker/CHECK_VAT', this.vat_checker)
    }
  }
}
