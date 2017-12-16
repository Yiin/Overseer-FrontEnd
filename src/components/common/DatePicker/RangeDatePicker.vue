<template lang="pug">
  .dropdown(
    v-clickaway='closeDatePicker'
    :class='dropdownClasses'
  )

    //-
      Main input (readonly)
      Shows currently selected date range

    .dropdown__input-wrapper(@click='toggle')
      input.dropdown__input.--datepicker(
        :class='dropdownInputClasses'
        v-model='date'
        :name='name'
        type='text'
        readonly
      )

    //-
      Show calendars if menu is open

    .calendars(v-if='isOpen')

      //-
        Main calendar

      .calendar__wrapper
        input.form__input.form__input--calendar(
          type='text'
          v-model='startDatePreview'
          @input='inputStartDate($event.target.value)'
        )

        //-
          Month controls
          left / right

        .calendar__controls
          .calendar__control-arrow(@click='prevMonth()')
            .arrow-left

          //-
            Current month

          .calendar__month {{ currentMonth.format('MMM YYYY') }}

          .calendar__control-arrow(@click='nextMonth()')
            .arrow-right

        //-
          The actual calendar

        .calendar(@mouseleave='previewDate()')

          //-
            Header with weekdays

          .weekdays
            .calendar__weekday(v-for='weekday in weekdays') {{ $t('weekdays.' + weekday) }}

          //-
            Days

          .calendar__week(v-for='week in calendar')
            .calendar__day(
              v-for='day in week'
              :class='getDayClasses(day)'
              @mouseover='previewDate(day.moment)'
              @mousedown='setStartDate(day.moment)'
            ) {{ day.date }}

      //-
        Additional Calendar for date range selection

      .calendar__wrapper
        input.form__input.form__input--calendar(
          type='text'
          v-model='endDatePreview'
          @input='inputEndDate($event.target.value)'
        )

        //-
          Month controls
          left / right

        .calendar__controls
          .calendar__control-arrow(@click='prevRangeMonth()')
            .arrow-left

          //-
            Current month

          .calendar__month {{ currentRangeMonth.format('MMM YYYY') }}

          .calendar__control-arrow(@click='nextRangeMonth()')
            .arrow-right

        //-
          The actual calendar

        .calendar(@mouseleave='previewDate()')

          //-
            Header with weekdays

          .weekdays
            .calendar__weekday(v-for='weekday in weekdays') {{ $t('weekdays.' + weekday) }}

          //-
            Days

          .calendar__week(v-for='week in rangeCalendar')
            .calendar__day(
              v-for='day in week'
              :class='getDayClasses(day)'
              @mouseover='previewDate(day.moment)'
              @mousedown='setEndDate(day.moment)'
            ) {{ day.date }}

</template>

<script>
import moment from 'moment'
import DateFormatsMixin from '@/mixins/date/formats'
import CalendarMixin from './mixins/CalendarMixin'

export default {
  mixins: [
    CalendarMixin,
    DateFormatsMixin
  ],

  props: {
    name: {
      type: String,
      default: 'date'
    },

    value: {
      type: [String, Object],
      default: undefined
    },

    nil: {
      type: Boolean,
      default: false
    },

    placeholder: {
      type: String
    }
  },

  data() {
    let range = this.value

    if (!range) {
      range = {
        start: undefined,
        end: undefined
      }
    }

    return {
      // Start date
      currentMonth: moment(range.start),
      startDate: moment(range.start),
      selectedStartDate: moment(range.start),

      // End date
      currentRangeMonth: moment(range.end).isSame(moment(range.start), 'month')
          ? moment(range.start).add(1, 'month')
          : moment(range.end),
      endDate: moment(range.end),
      selectedEndDate: moment(range.end),

      activeRange: null
    }
  },

  computed: {
    dropdownClasses() {
      return {
        'datepicker--open': this.isOpen
      }
    },

    dropdownInputClasses() {
      return {
        'dropdown__input--nil': this.nil
      }
    },

    getDayClasses() {
      return (day) => {
        return {
          'calendar__day--another-month': !day.isCurrentMonth,
          'calendar__day--start-date': !this.nil && day.moment.isSame(this.selectedStartDate || this.startDate, 'day'),
          'calendar__day--end-date': !this.nil && day.moment.isSame(this.selectedEndDate || this.endDate, 'day') && this.selectedStartDate.isBefore(this.endDate),
          'calendar__day--in-range': !this.nil && day.moment.isBetween(this.selectedStartDate || this.startDate, this.selectedEndDate || this.endDate)
        }
      }
    },

    date: {
      get() {
        if (this.nil) {
          return this.placeholder
        }
        const startDate = moment((this.value && this.value.start) || this.selectedStartDate)
        const endDate = moment((this.value && this.value.end) || this.selectedEndDate || this.endDate)

        return `${startDate.format(this.DATE_INPUT_FORMAT)} - ${endDate.format(this.DATE_INPUT_FORMAT)}`
      },

      set() {}
    },

    rangeCalendar() {
      return this.getCalendar(this.currentRangeMonth)
    },

    startDatePreview: {
      get() {
        return this.startDate ? this.startDate.format(this.DATE_INPUT_FORMAT) : ''
      },
      set(value) {
        if (value.length !== this.DATE_INPUT_FORMAT.length) {
          return
        }
        value.replace(/-/g, '/')
        value.replace(/ /g, '/')
        value.replace(/\./g, '/')

        const date = moment(value, this.DATE_INPUT_FORMAT)

        if (date.isValid()) {
          this.startDate = moment(date)
        }
      }
    },

    endDatePreview: {
      get() {
        return this.endDate ? this.endDate.format(this.DATE_INPUT_FORMAT) : ''
      },
      set(value) {
        if (value.length !== this.DATE_INPUT_FORMAT.length) {
          return
        }
        value.replace(/-/g, '/')
        value.replace(/ /g, '/')
        value.replace(/\./g, '/')

        const date = moment(value, this.DATE_INPUT_FORMAT)

        if (date.isValid()) {
          this.endDate = moment(date)
        }
      }
    },

    startDateIsSame() {
      return !this.selectedStartDate || this.selectedStartDate.isSame(this.startDate, 'day')
    },

    endDateIsSame() {
      return !this.selectedEndDate || this.selectedEndDate.isSame(this.endDate, 'day')
    }
  },

  watch: {
    value(range) {
      if (!range) {
        range = {
          start: undefined,
          end: undefined
        }
      }

      const currentStartDate = moment(this.selectedStartDate)
      const currentEndDate = moment(this.selectedEndDate)
      const newStartDate = moment(range && range.start)
      const newEndDate = moment(range && range.end)

      if (currentStartDate.isSame(newStartDate, 'day') && currentEndDate.isSame(newEndDate, 'day')) {
        // same date
        console.log('same date', this.date)
        return
      } else {
        console.log('set range', range)
      }

      // Start date
      this.currentMonth = moment(range.start)
      this.startDate = moment(range.start)
      this.selectedStartDate = moment(range.start)

      // End date
      this.currentRangeMonth = moment(range.end).isSame(moment(range.start), 'month')
          ? moment(range.start).add(1, 'month')
          : moment(range.end)
      this.endDate = moment(range.end)
      this.selectedEndDate = moment(range.end)
    },

    selectedStartDate(date) {
      this.startDate = date
      this.$emit('input-start', date)

      if (!date.isSame(this.currentMonth, 'month')) {
        this.currentMonth = date.clone()
      }

      if (this.selectedEndDate) {
        this.$emit('input', {
          start: date.format(),
          end: this.selectedEndDate.format()
        })
      }
    },

    selectedEndDate(date) {
      this.endDate = date
      this.$emit('input-end', date)

      if (date) {
        if (!date.isSame(this.currentRangeMonth, 'month') && !date.isSame(this.currentMonth, 'month')) {
          this.currentRangeMonth = date.clone()
        }

        this.$emit('input', {
          start: this.selectedStartDate.format(),
          end: date.format()
        })
      }
    }
  },

  mounted() {
    if (!this.nil) {
      this.$emit('input', {
        start: this.selectedStartDate.format(),
        end: this.selectedEndDate.format()
      })
    }
  },

  methods: {
    inputStartDate(input) {
      if (!input) {
        this.setStartDate(null, true)
        return
      }
      const date = moment(input, this.DATE_INPUT_FORMAT)

      if (date.year() >= 1000) {
        if (date.isValid()) {
          this.setStartDate(date, true)
        }
      }
    },

    inputEndDate(input) {
      const date = moment(input, this.DATE_INPUT_FORMAT)

      if (date.year() >= 1000) {
        if (date.isValid()) {
          this.setEndDate(date, true)
        }
      }
    },

    previewDate(date) {
      if (date) {
        if (this.selectedStartDate && !this.selectedEndDate) {
          this.endDate = date
        } else {
          this.startDate = date
        }
      } else {
        this.startDate = this.selectedStartDate
      }
    },

    /**
     * Calendar controls
     */
    nextMonth() {
      this.currentMonth.add(1, 'month')
      this.recalculateComputedProperty('calendar')
    },

    prevMonth() {
      this.currentMonth.subtract(1, 'month')
      this.recalculateComputedProperty('calendar')
    },

    nextRangeMonth() {
      this.currentRangeMonth.add(1, 'month')
      this.recalculateComputedProperty('rangeCalendar')
    },

    prevRangeMonth() {
      this.currentRangeMonth.subtract(1, 'month')
      this.recalculateComputedProperty('rangeCalendar')
    },

    setStartDate(date, force = false, usingKey = false) {
      if (!usingKey) {
        if (this.activeRange) {
          this.activeRange = null
          this.$emit('selected-key', null)
        }
      }
      if (force) {
        this.selectedStartDate = date.clone()
        if (this.selectedEndDate && this.selectedEndDate.isBefore(date)) {
          this.selectedEndDate = date.clone()
        }
        return
      }
      if (this.selectedStartDate && !this.selectedEndDate) {
        return this.setEndDate(date)
      }
      this.selectedStartDate = date.clone()
      this.selectedEndDate = null
    },

    setEndDate(date, force = false, usingKey = false) {
      if (!usingKey) {
        if (this.activeRange) {
          this.activeRange = null
          this.$emit('selected-key', null)
        }
      }
      if (force) {
        this.selectedEndDate = date.clone()
        if (this.selectedStartDate && this.selectedStartDate.isAfter(date)) {
          this.selectedStartDate = date.clone()
        }
        return
      }
      if (this.selectedStartDate && (date.isBefore(this.selectedStartDate) || this.selectedEndDate)) {
        this.selectedStartDate = date.clone()
        this.selectedEndDate = null
      } else {
        this.selectedEndDate = date.clone()
      }
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>

<style lang="scss" scoped>
// .datepicker--open {
  .dropdown__input::before,
  .dropdown__input-wrapper::before {
    right: 30px;
  }
// }
</style>