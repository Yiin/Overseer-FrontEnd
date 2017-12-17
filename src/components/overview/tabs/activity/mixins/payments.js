import moment from 'moment'

export default {
  methods: {
    paymentsForGraphData(dateFrom, dateTo) {
      return (payment) => payment.createdAt.isSameOrAfter(dateFrom) && payment.createdAt.isBefore(dateTo)
    },

    sumPayments(sum, payment) {
      return Number(sum) + Number(payment.amount.getIn(this.selectedCurrency))
    }
  },

  computed: {
    visiblePayments() {
      const startDate = this.dateRangeStart
      const endDate = this.dateRangeEnd

      return this.$repository('payments').aaCompanyItems.filter((payment) => {
        return !this.dateRange || moment(payment.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    paymentsGraphData() {
      let data = {}

      const startDate = this.dateRangeStart.clone()
      const endDate = this.dateRangeEnd.clone()

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format()

        if (!data[date]) {
          data[date] = 0
        }

        data[date] += this.visiblePayments
          .filter(this.paymentsForGraphData(startDate, nextDate))
          .reduce(this.sumPayments, 0)

        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    paymentsDataSet() {
      return Object.values(this.paymentsGraphData)
    }
  }
}
