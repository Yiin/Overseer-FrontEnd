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
    <div class="inline-select-head">
      <div class="inline-select-column"><!-- Checkbox --></div>
      <div v-for="column in columns" class="inline-select-column" :style="{ width: column.width }" :class="column.classList">
        {{ column.title }}
      </div>
    </div>
    <div class="inline-select__options">
      <div v-for="item in filteredItems" class="inline-select-row" @mousedown="select(item[itemValue])">
        <div class="inline-select-column">
          <input type="radio" v-model="localValue" :value="item[itemValue]" class="radio-option">
        </div>
        <div v-for="(column, index) in columns" class="inline-select-column" :style="{ width: column.width }" :classList="column.classList">
          <slot :name="`column-${index}`" :item="item">
            {{ item[itemText] }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Medium = require('@/vendor/medium.js/medium.patched').Medium

export default {
  name: 'form-inline-table-select',

  props: {
    placeholder: String,
    items: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'text'
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    value: {}
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
      if (!this.query) {
        return this.items
      } else {
        return this.items.filter(this.filterByQuery)
      }
    }
  },

  watch: {
    value(value) {
      if (value && value !== this.localValue) {
        this.localValue = value
      }
    },

    localValue(value) {
      if (value !== this.value) {
        this.select(value)
      }
    }
  },

  mounted() {
    // initiate Medium.js object on our search input
    this.medium = new Medium({
      element: this.$refs.searchInput,
      mode: Medium.inlineMode
    })

    if (!this.localValue && this.items.length) {
      this.select(this.items[0][this.itemValue])
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