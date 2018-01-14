import moment from 'moment'

export default {
  methods: {
    quotesForGraphData(dateFrom, dateTo) {
      return (quote) => quote.createdAt.isSameOrAfter(dateFrom) && quote.createdAt.isBefore(dateTo)
    },

    sumQuotes(sum, quote) {
      return Number(sum) + Number(quote.amount.getIn(this.selectedCurrency))
    }
  },

  computed: {
    visibleQuotes() {
      const startDate = this.dateRangeStart
      const endDate = this.dateRangeEnd

      return this.$repository('quotes').aaCompanyItems.filter((quote) => {
        return !this.dateRange || moment(quote.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    quotesGraphData() {
      let data = {}

      const startDate = this.dateRangeStart.clone()
      const endDate = this.dateRangeEnd.clone()

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format()

        if (!data[date]) {
          data[date] = 0
        }

        data[date] += this.visibleQuotes
          .filter(this.quotesForGraphData(startDate, nextDate))
          .reduce(this.sumQuotes, 0)

        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    quotesDataSet() {
      return Object.values(this.quotesGraphData)
    }
  }
}
