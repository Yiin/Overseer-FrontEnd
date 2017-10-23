<template>
  <div class="inline-select">
    <template v-if="watch && watch.length">
      <div v-if="!readonly" class="inline-select__search-wrapper">
        <div ref="searchInput"
             :data-placeholder="placeholder"
             class="inline-select__search-input mediumjs-input"></div>

        <div v-if="query && query.length"
             @click="clear"
             class="mediumjs-input-clear"
        ></div>
      </div>
      <div v-if="!readonly && tabular" class="inline-select-head">
        <inline-select-column></inline-select-column>
        <slot name="head"></slot>
      </div>
      <div class="inline-select__options scrollable">
        <template v-if="tabular">
          <slot name="rows"></slot>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </div>
    </template>
    <template v-else>
      <slot name="placeholder"></slot>
    </template>
  </div>
</template>

<script>
import he from 'he'
const Medium = require('@/vendor/medium.js/medium.patched').Medium

export default {
  name: 'inline-select',

  props: {
    placeholder: String,
    name: String,
    tabular: {
      type: Boolean,
      default: false
    },
    watch: {
      default: undefined
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      medium: null,
      query: ''
    }
  },

  watch: {
    query: function () {
      this.options.forEach((option) => {
        option.isVisible = this.shouldBeVisible(option)
      })
    }
  },

  computed: {
    headColumns() {
      if (this.tabular) {
        return this.$slots.head
          .filter((el) => el.tag && el.tag.indexOf('inline') > -1)
          .map((column) => column.componentInstance)
      }
      return []
    },

    options() {
      if (this.tabular) {
        return this.$slots.rows
          .filter((el) => el.tag && el.tag.indexOf('inline') > -1)
          .map((column) => column.componentInstance)
      }
      return this.$slots.default ? this.$slots.default
          .filter((el) => el.tag && el.tag.indexOf('inline') > -1)
          .map((column) => column.componentInstance) : []
    },

    searchTerms() {
      return (
          he.decode(this.query)
          .trim()
          .toLowerCase()
          .match(/[^\s"]+|"([^"]*)"/gi) || []
        ).map((term) => term.replace(/"/g, ''))
    }
  },

  mounted() {
    if (this.$refs.searchInput) {
    }

    if (this.watch) {
      this.$watch(() => this.watch, () => {
        this.recalculateComputedProperty('options')
          .then(() => {
            this.$nextTick(this.updateRows)
          })
      })
    }

    this.updateRows()
  },

  methods: {
    recalculateComputedProperty(property) {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          this._computedWatchers[property].update()
          this.$forceUpdate()
          resolve()
        })
      })
    },

    // option should be visible only
    shouldBeVisible(option) {
      // if we're not searching for anything
      if (!this.query) {
        return true
      }
      // or this option matches search criterias
      const searchable = option.searchable.trim().toLowerCase()
      const query = this.searchTerms

      for (let i = 0; i < query.length; ++i) {
        if (searchable.indexOf(query[i]) > -1) {
          return true
        }
      }
      // else ignore it completely
      return false
    },

    updateRows() {
      let selected = false

      // name options and listen to input events
      this.options.forEach((option) => {
        option.name = this.name
        option.readonly = this.readonly

        option.$on('input', (e) => {
          if (!this.readonly) {
            if (this.$parent) {
              this.$parent.$emit('input:field', {
                name: option.name,
                value: e
              })
            }
            this.$emit('input', e)
          }
        })

        if (option.selected || this.readonly) {
          option.$refs.input.click()
          selected = true
        }
      })

      // Select first option, if no one is selected
      if (!selected && this.options.length) {
        this.options[0].$refs.input.click()
      }

      this.headColumns.forEach((column, index) => {
        this.options.forEach((row) => {
          let width = column.width

          if (column.width.indexOf('%') > -1) {
            width = parseFloat(column.width.replace('%', '')) / 100
            width = `calc(${column.width} - (60px * ${width}))`
          }
          row.columns[index].setWidth(width)
          row.columns[index].setAlign(column.align)
        })
      })
    },

    clear() {
      this.medium.value('')
      this.query = ''
    }
  }
}
</script>