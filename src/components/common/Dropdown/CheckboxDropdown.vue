<template>
  <dropdown ref="dropdown" @input="onInput" :placeholder="placeholder">
    <dropdown-checkbox-option ref="checkboxShowAll" @toggle="handleAll" value="__ALL__" :checked="true">
      {{ $t('filters.show_all') }}
    </dropdown-checkbox-option>
    <dropdown-separator></dropdown-separator>
    <slot></slot>
  </dropdown>
</template>

<script>
export default {
  name: 'checkbox-dropdown',

  props: ['placeholder'],

  computed: {
    dropdown() {
      return this.$refs.dropdown
    },

    options() {
      return this.dropdown.options
    },

    checkboxAll() {
      return this.$refs.checkboxShowAll
    }
  },

  methods: {
    onInput(e) {
      if (!e.length) {
        this.checkboxAll.check()
      } else {
        this.checkboxAll.uncheck()
      }
      this.$emit('input', e)
    },

    handleAll() {
      this.dropdown.resetValue()
    }
  }
}
</script>