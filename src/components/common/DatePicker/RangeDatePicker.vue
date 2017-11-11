<template>
  <div v-clickaway="closeDatePicker" class="dropdown" :class="{ 'datepicker--open': isOpen }">
    <div @click="toggle" class="dropdown__input-wrapper">
      <input class     = "dropdown__input --datepicker"
             :class    = "{ 'dropdown__input--nil': nil }"
             v-model   = "date"
             :name     = "name"
             type      = "text"
             readonly>
    </div>
    <div v-if="isOpen" class="calendars">
      <!--
        Main Calendar
       -->
      <div class="calendar__wrapper">
        <input type="text" @input="inputStartDate($event.target.value)" v-model="startDatePreview" class="form__input form__input--calendar" readonly>
        <div class="calendar__controls">
          <div @click="prevMonth()" class="calendar__control-arrow">
            <div class="arrow-left"></div>
          </div>
          <div class="calendar__month">
            {{ currentMonth.format('MMM YYYY') }}
          </div>
          <div @click="nextMonth()" class="calendar__control-arrow">
            <div class="arrow-right"></div>
          </div>
        </div>
        <div class="calendar" @mouseleave="previewDate()">
          <div class="weekdays">
            <div v-for="weekday in weekdays" class="calendar__weekday">
              {{ $t('weekdays.' + weekday) }}
            </div>
          </div>
          <div v-for="week in calendar" class="calendar__week">
            <div
              v-for="day in week"
              class="calendar__day"
              :class="{
                'calendar__day--another-month': !day.isCurrentMonth,
                'calendar__day--start-date': !nil && day.moment.isSame(selectedStartDate || startDate, 'day'),
                'calendar__day--end-date': !nil && day.moment.isSame(selectedEndDate || endDate, 'day') && selectedStartDate.isBefore(endDate),
                'calendar__day--in-range': !nil && day.moment.isBetween(selectedStartDate || startDate, selectedEndDate || endDate)
              }"
              @mouseover="previewDate(day.moment)"
              @mousedown="setStartDate(day.moment)"
            >
              {{ day.date }}
            </div>
          </div>
        </div>
      </div>

      <!--
        Additional Calendar for date range selection
      -->
      <div class="calendar__wrapper">
        <input type="text" @input="inputStartDate($event.target.value)" v-model="endDatePreview" class="form__input form__input--calendar" readonly>
        <div class="calendar__controls">
          <div @click="prevRangeMonth()" class="calendar__control-arrow">
            <div class="arrow-left"></div>
          </div>
          <div class="calendar__month">
            {{ currentRangeMonth.format('MMM YYYY') }}
          </div>
          <div @click="nextRangeMonth()" class="calendar__control-arrow">
            <div class="arrow-right"></div>
          </div>
        </div>
        <div class="calendar" @mouseleave="previewDate()">
          <div class="weekdays">
            <div v-for="weekday in weekdays" class="calendar__weekday">
              {{ $t('weekdays.' + weekday) }}
            </div>
          </div>
          <div v-for="week in rangeCalendar" class="calendar__week">
            <div
              v-for="day in week"
              class="calendar__day"
              :class="{
                'calendar__day--another-month': !day.isCurrentMonth,
                'calendar__day--start-date': !nil && day.moment.isSame(selectedStartDate || startDate, 'day'),
                'calendar__day--end-date': !nil && day.moment.isSame(selectedEndDate || endDate, 'day') && selectedStartDate.isBefore(endDate),
                'calendar__day--in-range': !nil && day.moment.isBetween(selectedStartDate || startDate, selectedEndDate || endDate)
              }"
              @mouseover="previewDate(day.moment)"
              @mousedown="setEndDate(day.moment)"
            >
              {{ day.date }}
            </div>
          </div>
        </div>
      </div>

      <!--
        Predefined ranges
      -->
      <div class="calendar__predefined-ranges-list">
        <div
            v-for="range in predefinedRanges"
            @click="setRange(range)"
            :class="{ 'calendar__predefined-range--selected': !nil && activeRange && activeRange === range }"
            class="calendar__predefined-range"
        >
          {{ $t(range.name) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import CalendarMixin from './mixins/CalendarMixin'

const currentDate = moment()
const predefinedRanges = [
  { key: 'last7', name: 'datetime.last7', start: moment().subtract(7, 'days'), end: currentDate },
  { key: 'last30', name: 'datetime.last30', start: moment().subtract(30, 'days'), end: currentDate },
  { key: 'month', name: 'datetime.month', start: moment().startOf('month'), end: currentDate },
  { key: 'year', name: 'datetime.year', start: moment().startOf('year'), end: currentDate },
  { key: 'lastyear', name: 'datetime.lastyear', start: moment().subtract(1, 'year').startOf('year'), end: moment().subtract(1, 'year').endOf('year') }
]

export default {
  mixins: [
    CalendarMixin
  ],

  props: {
    name: {
      type: String,
      default: 'date'
    },

    range: {
      required: true
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
    let range = this.range
    let activeRange

    if (typeof this.range === 'string') {
      range = predefinedRanges.find((r) => r.key === this.range)
      activeRange = range
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

      activeRange
    }
  },

  computed: {
    predefinedRanges() {
      return predefinedRanges
    },

    date: {
      get() {
        if (this.nil) {
          return this.placeholder
        }
        const startDate = moment((this.value && this.value.start) || this.selectedStartDate)
        const endDate = moment((this.value && this.value.end) || this.selectedEndDate || this.endDate)

        return `${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}`
      },
      set() {}
    },

    rangeCalendar() {
      return this.getCalendar(this.currentRangeMonth)
    },

    startDatePreview: {
      get() {
        return this.startDate ? this.startDate.format('MMM D, YYYY') : ''
      },
      set() {}
    },

    endDatePreview: {
      get() {
        return this.endDate ? this.endDate.format('MMM D, YYYY') : ''
      },
      set() {}
    },

    startDateIsSame() {
      return !this.selectedStartDate || this.selectedStartDate.isSame(this.startDate, 'day')
    },

    endDateIsSame() {
      return !this.selectedEndDate || this.selectedEndDate.isSame(this.endDate, 'day')
    }
  },

  watch: {
    selectedStartDate: function (date) {
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

    selectedEndDate: function (date) {
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
    if (typeof this.range === 'string') {
      this.$emit('selected-key', this.range)
    }
    if (!this.nil) {
      this.$emit('input', {
        start: this.selectedStartDate.format(),
        end: this.selectedEndDate.format()
      })
    }
  },

  methods: {
    setRange(range) {
      this.activeRange = range
      this.setStartDate(range.start, true, true)
      this.setEndDate(range.end, true, true)
      this.$emit('selected-key', range.key)
      if (range.start.isSame(range.end, 'month')) {
        this.currentRangeMonth = this.currentRangeMonth.add(1, 'month')
        this.recalculateComputedProperty('rangeCalendar')
      }
    },

    inputStartDate(input) {
      if (!input) {
        this.setStartDate(null, true)
        return
      }
      const date = moment(input)

      if (date.year() >= 1000) {
        if (date.isValid()) {
          this.setStartDate(date, true)
        }
      }
    },

    inputEndDate(input) {
      const date = moment(input)

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