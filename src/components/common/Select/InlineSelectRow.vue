<template>
  <div v-show="isVisible" class="inline-select-row" @click="$refs.input.click()">
    <inline-select-column>
      <input @click="click" :name="name" ref="input" :value="value" type="radio" class="radio-option">
    </inline-select-column>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'inline-select-row',

  props: ['value', 'selected', 'searchable'],

  data() {
    return {
      isVisible: true,
      name: ''
    }
  },

  computed: {
    columns() {
      return this.$slots.default
        .filter((el) => el.tag && el.tag.indexOf('inline') > -1)
        .map((column) => column.componentInstance)
    }
  },

  watch: {
    selected(val) {
      if (val) {
        this.$refs.input.click()
      }
    }
  },

  methods: {
    click() {
      this.$emit('input', this.value)
    }
  }
}
</script>