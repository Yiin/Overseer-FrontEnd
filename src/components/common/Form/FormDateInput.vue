<template>
  <div class="date__input" v-clickaway="hide">
    <input type="text" v-model="formattedValue" class="form__input" @focus="show">
    <v-date-picker landscape class="datePicker" v-show="isOpen" @input="hide" v-model="localValue" scrollable actions></v-date-picker>
  </div>
</template>

<script>
import moment from 'moment'
import {
  VDatePicker
} from 'vuetify'

export default {
  name: 'form-date-input',

  components: {
    VDatePicker
  },

  props: {
    currentDate: {
      type: Boolean,
      default: false
    },

    value: {}
  },

  data() {
    let localValue = null

    if (this.value) {
      if (typeof this.value === 'object') {
        localValue = moment(this.value.date).format('YYYY-MM-DD')
      } else {
        localValue = moment(this.value).format('YYYY-MM-DD')
      }
    } else if (this.currentDate) {
      localValue = moment().format('YYYY-MM-DD')
    }
    return {
      isOpen: false,
      localValue,
      separator: '/'
    }
  },

  computed: {
    formattedValue: {
      get() {
        if (!this.localValue) {
          return ''
        }
        return moment(this.localValue).format('DD/MM/YY')
      },
      set(value) {
        if (value.length !== 'DD/MM/YY'.length) {
          return
        }
        value.replace(/-/g, '/')
        value.replace(/ /g, '/')
        value.replace(/\./g, '/')

        const date = moment(value, 'DD/MM/YY')

        if (date.isValid()) {
          this.localValue = moment(date).format('YYYY-MM-DD')
        }
      }
    }
  },

  methods: {
    show() {
      this.isOpen = true
    },

    hide() {
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss">
.date__input {
  position: relative;

  .datePicker {
    position: absolute;
    z-index: 1;
    line-height: initial;
    // right: -50px;
  }
}
</style>