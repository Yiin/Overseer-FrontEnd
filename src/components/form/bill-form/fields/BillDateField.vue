<template lang="pug">
  div
    .billTitle.billTitle--weekday {{ invoiceDateWeekday }}

    date-picker(
      current-date
      v-model='date'
      @update-input='updateDateInput'
    )
      .billDate(
        slot='activator'
        slot-scope='{ parent }'
        @click='parent.onFocus'
        v-clickaway='parent.onBlur'
      ) {{ invoiceDateDay }}#[sup {{ invoiceDateDayOrdinal }}] {{ invoiceDateMonth }}, {{ invoiceDateYear }}
      //-
        input.custom(
          slot='activator'
          slot-scope='{ parent }'
          type='text'
          placeholder='Select Date'
          v-model='dateInput'
          @focus='parent.onFocus'
          @blur='parent.onBlur'
          @input='parent.onInput'
          data-lpignore='true'
        )
</template>

<script>
import DatePicker from '@/components/common/DatePicker/DatePicker.vue'

export default {
  components: {
    DatePicker
  },

  data() {
    return {
      date: null,
      dateInput: ''
    }
  },

  computed: {
    invoiceDateWeekday() {
      return 'Tuesday'
    },

    invoiceDateDay() {
      return '7'
    },

    invoiceDateDayOrdinal() {
      return 'th'
    },

    invoiceDateMonth() {
      return 'June'
    },

    invoiceDateYear() {
      return '2018'
    }
  },

  methods: {
    updateDateInput(input) {
      this.dateInput = input
    }
  }
}
</script>