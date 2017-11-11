<template>
  <div class="inline-select">
    <div class="inline-select__search-wrapper">
      <div ref="searchInput"
        @input="onInput"
        :data-placeholder="placeholder"
        class="inline-select__search-input mediumjs-input"
      ></div>
      <div v-if="query && query.length"
        @click="clear"
        class="mediumjs-input-clear"
      ></div>
    </div>
    <div class="inline-select__options scrollable">
      <div v-for="item in filteredItems" class="inline-option" @mousedown="select(item.value)">
        <slot name="option" :item="item">
          <input type="radio" v-model="localValue" :value="item.value" class="radio-option">
          <div class="inline-option__label">
            {{ item.text }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
const Medium = require('@/vendor/medium.js/medium.patched')

export default {
  name: 'form-inline-select-input',

  props: {
    placeholder: String,
    items: {
      type: Array,
      default: () => []
    },
    value: {},
    lastItemValue: {}
  },

  data() {
    return {
      localValue: this.value,
      medium: null,
      query: ''
    }
  },

  computed: {
    filteredItems() {
      let items = this.items

      // we have a value that we need to show first
      if (this.lastItemValue) {
        const currentIndex = items.findIndex((item) => item.value === this.lastItemValue)

        if (currentIndex > -1) {
          items.splice(0, 0, items.splice(currentIndex, 1)[0])
        }
      }
      if (!this.query) {
        return items
      } else {
        return items.filter(this.filterByQuery)
      }
    }
  },

  watch: {
    value(value) {
      if (value) {
        this.localValue = value
      }
    },

    localValue(value) {
      this.select(value)
    }
  },

  mounted() {
    // initiate Medium.js object on our search input
    this.medium = new Medium({
      element: this.$refs.searchInput,
      mode: Medium.inlineMode
    })

    if (!this.localValue && this.items.length) {
      this.select(this.items[0].value)
    }
  },

  methods: {
    onInput() {
      let value = this.medium.value().trim().toLowerCase()

      if (this.query !== value) {
        this.query = value
      }
    },

    clear() {
      this.medium.value('')
      this.query = ''
    },

    filterByQuery(item) {
      return item.text.toLowerCase().indexOf(this.query.toLowerCase()) > -1
    },

    select(value) {
      this.$emit('input', value)
    }
  }
}
</script>