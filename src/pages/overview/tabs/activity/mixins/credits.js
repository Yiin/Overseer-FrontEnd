import moment from 'moment'

export default {
  methods: {
    creditsForGraphData(dateFrom, dateTo) {
      return (credit) => credit.createdAt.isSameOrAfter(dateFrom) && credit.createdAt.isBefore(dateTo)
    },

    sumCredits(sum, credit) {
      return Number(sum) + Number(credit.balance.getIn(this.selectedCurrency))
    }
  },

  computed: {
    visibleCredits() {
      const startDate = this.dateRangeStart
      const endDate = this.dateRangeEnd

      return this.$repository('credits').aaCompanyItems.filter((credit) => {
        return !this.dateRange || moment(credit.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    creditsGraphData() {
      let data = {}

      const startDate = this.dateRangeStart.clone()
      const endDate = this.dateRangeEnd.clone()

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format()

        if (!data[date]) {
          data[date] = 0
        }

        data[date] += this.visibleCredits
          .filter(this.creditsForGraphData(startDate, nextDate))
          .reduce(this.sumCredits, 0)

        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    creditsDataSet() {
      return Object.values(this.creditsGraphData)
    }
  }
}
