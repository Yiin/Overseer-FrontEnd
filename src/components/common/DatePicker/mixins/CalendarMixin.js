import moment from 'moment'

export default {
  data() {
    return {
      isOpen: false
    }
  },

  computed: {
    weekdays() {
      return ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']
    },

    calendar() {
      return this.getCalendar(this.currentMonth)
    }
  },

  methods: {
    toggle() {
      if (this.readonly) {
        return
      }
      this.isOpen = !this.isOpen
    },

    closeDatePicker() {
      if (this.isOpen) {
        this.isOpen = false
      }
    },

    /**
     * Helpers
     */
    getFirstDayOfTheMonth(date) {
      return moment(date).date(1).isoWeekday(1)
    },

    getLastDayOfTheMonth(date) {
      let lastDayOfTheMonth = moment(date).endOf('month')

      if (lastDayOfTheMonth.isoWeekday() !== 7) {
        lastDayOfTheMonth = lastDayOfTheMonth.endOf('week')
      }

      return lastDayOfTheMonth
    },

    /**
     * Get days of the weeks in the month
     */
    getCalendar(calendarMonth) {
      const currentDay = moment(this.getFirstDayOfTheMonth(calendarMonth))
      const lastDayOfTheMonth = moment(this.getLastDayOfTheMonth(calendarMonth))

      const weeks = []

      do {
        weeks.push([])
        do {
          const isCurrentMonth = calendarMonth.isSame(currentDay, 'month')

          const day = {
            isCurrentMonth,
            date: currentDay.date(),
            moment: currentDay.clone()
          }
          weeks[weeks.length - 1].push(day)
        }
        while (currentDay.add(1, 'day').isoWeekday() !== 1)
      }
      while (!currentDay.isAfter(lastDayOfTheMonth))

      if (weeks.length === 4) {
        const x = moment(this.getFirstDayOfTheMonth(calendarMonth)).subtract(7, 'days')

        weeks.unshift([])

        for (let i = 0; i < 7; ++i) {
          const day = {
            isCurrentMonth: false,
            date: x.date(),
            moment: x.clone()
          }
          weeks[0].push(day)
          x.add(1, 'day')
        }
      }
      if (weeks.length === 5) {
        const x = moment(this.getLastDayOfTheMonth(calendarMonth)).add(2, 'days')

        weeks.push([])

        for (let i = 0; i < 7; ++i) {
          const day = {
            isCurrentMonth: false,
            date: x.date(),
            moment: x.clone()
          }
          weeks[weeks.length - 1].push(day)
          x.add(1, 'day')
        }
      }

      return weeks
    },

    recalculateComputedProperty(property) {
      this.$nextTick(() => {
        this._computedWatchers[property].update()
        this.$forceUpdate()
      })
    }
  }
}
