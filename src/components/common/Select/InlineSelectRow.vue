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

  methods: {
    click() {
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="scss">
.inline-select-row {
    display: flex;
    font-size: 16px;
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #e1e1e1;
    cursor: default;
}
.inline-select-row:hover {
    background: #fbfbfb;
}
</style>