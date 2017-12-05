<template>
  <div v-clickaway="closeDatePicker" class="dropdown dropdown--datepicker" :class="{ 'datepicker--open': isOpen }">
    <div @click="toggle" class="dropdown__input-wrapper">
      <input class     = "dropdown__input"
             v-model   = "date"
             :name     = "name"
             type      = "text"
             :readonly = "readonly"
             data-lpignore="true"
      >
      <i class="icon-calendar-weekly"></i>
    </div>
    <div v-if="isOpen" class="calendars">
      <!--
        Main Calendar
       -->
      <div class="calendar__wrapper">
        <div class="calendar__controls">
          <div @click="prevMonth()" class="calendar__control-arrow">
            <!-- <i class="icon-prev"></i> -->
            <div class="arrow-left"></div>
          </div>
          <div class="calendar__month">
            {{ currentMonth.format('MMM YYYY') }}
          </div>
          <div @click="nextMonth()" class="calendar__control-arrow">
            <!-- <i class="icon-next"></i> -->
            <div class="arrow-right"></div>
          </div>
        </div>
        <div class="calendar">
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
                'calendar__day--selected-date': day.moment.isSame(selectedDate, 'day')
              }"
              @mousedown="setDate(day.moment)"
            >
              {{ day.date }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import CalendarMixin from './mixins/CalendarMixin'

export default {
  mixins: [
    CalendarMixin
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

  methods: {
    inputDate(input) {
      if (!input) {
        this.setDate(null, true)
        return
      }
      const date = moment(input)

      if (date.year() >= 1000) {
        if (date.isValid()) {
          this.setDate(date, true)
        }
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

    setDate(date, input = false) {
      this.selectedDate = date
      if (!date.isSame(this.currentMonth, 'month')) {
        this.currentMonth.year(date.year()).month(date.month())
      }
      if (!input) {
        this.closeDatePicker()
      }
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
</style>
