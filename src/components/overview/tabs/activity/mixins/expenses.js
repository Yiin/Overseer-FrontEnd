import moment from 'moment'

export default {
  methods: {
    expensesForGraphData(dateFrom, dateTo) {
      return (expense) => expense.createdAt.isSameOrAfter(dateFrom) && expense.createdAt.isBefore(dateTo)
    },

    sumExpenses(sum, expense) {
      return Number(sum) + Number(expense.amount.getIn(this.selectedCurrency))
    }
  },

  computed: {
    visibleExpenses() {
      const startDate = this.dateRangeStart
      const endDate = this.dateRangeEnd

      return this.$repository('expenses').aaCompanyItems.filter((expense) => {
        return !this.dateRange || moment(expense.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    expensesGraphData() {
      let data = {}

      const startDate = this.dateRangeStart.clone()
      const endDate = this.dateRangeEnd.clone()

      console.log('expensesGraphData', this.graphInterval, startDate.format(), endDate.format())

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format()

        if (!data[date]) {
          data[date] = 0
        }

        data[date] += this.visibleExpenses
          .filter(this.expensesForGraphData(startDate, nextDate))
          .reduce(this.sumExpenses, 0)

        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      console.log('expensesGraphData', data)

      return data
    },

    expensesDataSet() {
      return Object.values(this.expensesGraphData)
    }
  }
}
