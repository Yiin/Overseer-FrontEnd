<template lang="pug">
  .dropdown.dropdown--datepicker(
    v-clickaway="closeDatePicker"
    :class="datepickerClasses"
  )
    .dropdown__input-wrapper
      slot(name='activator' :parent='_self')
        input.dropdown__input(
          v-model   = "date"
          :name     = "name"
          type      = "text"
          :readonly = "readonly"
          data-lpignore="true"
        )
        i.icon-calendar-weekly

    .calendars(v-if="isOpen")

      //-
        Main Calendar

      .calendar__wrapper
        .calendar__controls
          .calendar__control-arrow(@click="prevMonth()")
            .arrow-left

          .calendar__month {{ currentMonth.format('MMM YYYY') }}

          .calendar__control-arrow(@click="nextMonth()")
            .arrow-right

        .calendar
          .weekdays
            .calendar__weekday(v-for="weekday in weekdays") {{ $t('weekdays.' + weekday) }}

          .calendar__week(v-for="week in calendar")
            .calendar__day(
              v-for="day in week"
              :class="getDayClasses(day)"
              @mousedown="setDate(day.moment)"
            ) {{ day.date }}

</template>

<script>
import moment from 'moment'
import CalendarMixin from './mixins/CalendarMixin'
import DateFormatsMixin from '@/mixins/date/formats'

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
      type: [String, Object]
    },

    readonly: {
      type: Boolean,
      default: false
    },

    upsidedown: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const hasValue = !!this.value
    const value = typeof this.value === 'object' && this.value !== null && !this.value._isAMomentObject
      ? this.value.date
      : this.value

    return {
      isOpen: false,

      currentMonth: hasValue ? moment(value) : moment(),
      selectedDate: hasValue ? moment(value) : null
    }
  },

  computed: {
    date: {
      get() {
        return (this.value || this.selectedDate)
          ? moment(this.value || this.selectedDate).format('MMM D, YYYY')
          : ''
      },

      set(input) {
        this.inputDate(input)
      }
    },

    calendar() {
      return this.getCalendar(this.currentMonth)
    },

    datepickerClasses() {
      return {
        'datepicker--open': this.isOpen,
        'datepicker--upsidedown': this.upsidedown
      }
    },

    getDayClasses() {
      return (day) => ({
        'calendar__day--another-month': !day.isCurrentMonth,
        'calendar__day--selected-date': day.moment.isSame(this.selectedDate, 'day')
      })
    }
  },

  watch: {
    value: function (value) {
      const date = moment(value)
      if (date.isValid() && !date.isSame(this.selectedDate)) {
        this.setDate(moment(value))
      }
    },

    selectedDate: function (date) {
      if (date) {
        this.$emit('input', date.format())
      } else {
        this.currentMonth = moment()
        this.$emit('input', null)
      }
    }
  },

  mounted() {
    this.emitInputUpdate()
  },

  methods: {
    inputDate(input) {
      if (!input) {
        this.setDate(null, true)
        return
      }
      const date = moment(input, this.DATE_INPUT_FORMAT)

      if (date.year() >= 1000) {
        if (date.isValid()) {
          this.setDate(date, true)
        }
      }
    },

    emitInputUpdate() {
      this.$emit('update-input', this.selectedDate && this.selectedDate.format(this.DATE_INPUT_FORMAT))
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

    setDate(date, input = false) {
      this.selectedDate = date
      if (!date.isSame(this.currentMonth, 'month')) {
        this.currentMonth.year(date.year()).month(date.month())
      }
      if (!input) {
        this.closeDatePicker()
      }
      if (!this.isTyping) {
        this.emitInputUpdate()
      }
    },

    onFocus() {
      this.isTyping = true
      this.openDatePicker()
    },

    onBlur() {
      this.isTyping = false
      // this.closeDatePicker()
      this.emitInputUpdate()
    },

    onInput(e) {
      this.isTyping = true

      this.inputDate(e.target.value)
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
<style lang="scss" scoped>
.dropdown__input::before,
.dropdown__input-wrapper::before {
  right: 30px;
}

.dropdown--datepicker .dropdown__input-wrapper::before,
.dropdown--datepicker .dropdown__input::before {
  border: none;
}

.dropdown--datepicker .dropdown__input + i {
  position: absolute;
  top: 14px;
  right: 15px;
  color: #373737;
  cursor: text;
}

.dropdown--datepicker.datepicker--open .dropdown__input + i {
  right: 25px;
  color: #000;
}

.datepicker--open:not(.datepicker--upsidedown) {
    .calendars::after {
        content: '';
        display: inline-block;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        position: absolute;
        right: 38px;
        top: -6px;
        border-top: 0;
        border-bottom: 6px solid #fff;
        filter: drop-shadow(0px -3px 1px rgba(0, 0, 0, 0.04));
    }
}


.datepicker--upsidedown {
    .calendars {
        bottom: 53px;
        left: 0;
        top: auto;
        right: auto;
    }

    .calendars::after {
        content: '';
        display: inline-block;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        position: absolute;
        left: 7px;
        bottom: -6px;
        border-bottom: 0;
        border-top: 6px solid #fff;
        filter: drop-shadow(0px 3px 1px rgba(0,0,0,0.12));
    }
}
</style>
