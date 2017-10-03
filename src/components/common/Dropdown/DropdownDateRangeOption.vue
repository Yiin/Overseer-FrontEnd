<template>
  <div class="dropdown__option dropdown__option--date-range"
       v-clickaway="blur"
       @blur="blur"
       :class="{ 'dropdown__option--open': isOpen }"
       :tabindex="name">

    <range-date-picker
      range="last7"
      v-model="localValue"
      @input="onInput"
      @input-start="onSomeInput"
      @input-end="onSomeInput"
      :nil="nil"
      :placeholder="placeholder"
    ></range-date-picker>

    <div @click="clear"
         v-if="!nil"
         class="mediumjs-input-clear"
    ></div>
  </div>
</template>

<script>
import RangeDatePicker from '@/components/common/DatePicker/RangeDatePicker.vue'

export default {
  props: ['name', 'placeholder'],

  components: {
    RangeDatePicker
  },

  data() {
    return {
      isOpen: false,
      localValue: null,
      nil: true
    }
  },

  computed: {
    value() {
      return this.nil ? null : this.localValue
    }
  },

  methods: {
    blur() {
      this.isOpen = false
    },

    clear() {
      this.nil = true
      this.blur()
      this.$emit('input-changed')
    },

    onInput() {
      this.nil = false
      this.$emit('input-changed')
    },

    onSomeInput() {
      this.nil = false
    }
  }
}
</script>

<style lang="scss">
.dropdown__option--date-range {
  position: relative;
}

.dropdown__option.dropdown__option--date-range {
  .dropdown--open .dropdown__input::before,
  .dropdown--open .dropdown__input-wrapper::before {
    border-color: transparent !important;
  }
  .dropdown__option--date-range .calendars {
    top: 35px;
    right: -15px;
  }
  .calendar__predefined-range {
    line-height: .8;
  }
  .dropdown__input {
    background: transparent;
    box-shadow: none;
    padding: 0;
    color: #000000;
    margin: 0;
    height: 34px;
  }
}
</style>