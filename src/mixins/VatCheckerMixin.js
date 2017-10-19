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
      const memberState = this.passive.member_states.find((state) => state.code.toUpperCase() === cc)

      if (memberState) {
        this.vat_checker.country_code = cc
        this.vat_checker.number = number.slice(2)
      }
    }
  },

  computed: {
    vatCheckerResults() {
      return this.$store.state.features.vat_checker.results.map((result) => {
        result.checked_time_ago = moment(result.created_at).fromNow()
        return result
      })
    }
  },

  methods: {
    checkVat() {
      this.$store.dispatch('features/vat_checker/CHECK_VAT', this.vat_checker)
    }
  }
}
