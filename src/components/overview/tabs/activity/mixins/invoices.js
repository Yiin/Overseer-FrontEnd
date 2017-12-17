import moment from 'moment'

export default {
  methods: {
    invoicesForGraphData(dateFrom, dateTo) {
      return (invoice) => invoice.createdAt.isSameOrAfter(dateFrom) && invoice.createdAt.isBefore(dateTo)
    },

    sumInvoices(sum, invoice) {
      return Number(sum) + Number(invoice.amount.getIn(this.selectedCurrency))
    }
  },

  computed: {
    visibleInvoices() {
      const startDate = this.dateRangeStart
      const endDate = this.dateRangeEnd

      return this.$repository('invoices').aaCompanyItems.filter((invoice) => {
        return !this.dateRange || moment(invoice.createdAt)
          .isBetween(
            moment(startDate),
            moment(endDate),
            'days',
            '[]' // inclusive
          )
      })
    },

    invoicesGraphData() {
      let data = {}

      const startDate = this.dateRangeStart.clone()
      const endDate = this.dateRangeEnd.clone()

      do {
        const nextDate = startDate.clone().add(1, this.graphInterval)
        const date = startDate.format()

        if (!data[date]) {
          data[date] = 0
        }

        data[date] += this.visibleInvoices
          .filter(this.invoicesForGraphData(startDate, nextDate))
          .reduce(this.sumInvoices, 0)

        startDate.add(1, this.graphInterval)
      }
      while (!startDate.isSameOrAfter(endDate, this.graphInterval))

      return data
    },

    invoicesDataSet() {
      return Object.values(this.invoicesGraphData)
    }
  }
}
