<template>
  <div class="inline-select">
      <div class="inline-select__search-wrapper">
        <div ref="searchInput"
             :data-placeholder="placeholder"
             class="inline-select__search-input mediumjs-input"></div>

        <div v-show="query && query.length"
             @click="clear"
             class="mediumjs-input-clear"
        ></div>
      </div>
      <div v-if="tabular" class="inline-select-head">
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
    // initiate Medium.js object on our search input
    this.medium = new Medium({
      element: this.$refs.searchInput,
      mode: Medium.inlineMode
    })

    this.$refs.searchInput.addEventListener('input', () => {
      let value = this.medium.value().trim().toLowerCase()

      if (this.query !== value) {
        this.query = value
      }
    })

    if (this.watch) {
      this.$watch(() => this.watch, () => {
        this.recalculateComputedProperty('options')
        this.$nextTick(() => {
          this.updateRows()
        })
      })
    }

    this.updateRows()
  },

  methods: {
    recalculateComputedProperty(property) {
      this.$nextTick(() => {
        this._computedWatchers[property].update()
        this.$forceUpdate()
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
      // name options and listen to input events
      this.options.forEach((option) => {
        option.name = this.name

        option.$on('input', (e) => {
          this.$emit('input', e)
        })

        if (option.selected && !this.value) {
          option.$refs.input.click()
        }
      })

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

<style lang="scss">
.inline-select {
  margin-top: -20px;
}

.inline-select-head {
    display: flex;
    height: 35px;
    line-height: 35px;
    border-top: 1px solid #e1e1e1;
    border-bottom: 1px solid #e1e1e1;
    margin-right: 6px;
    font-weight: $font-weight-semibold;
}

.inline-select-column:first-child {
  width: 60px;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inline-select-column:not(:first-child) {
    padding: 0 15px;
}

.inline-select-column {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.inline-select__search-wrapper {
    position: relative;
}

.inline-select__search-input
{
    font-size: 16px;
    font-weight: 600;
    line-height: 52px;
    height: 52px;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    color: $color-main;
    /**
     * On focus show basic text w/o much styling
     */
    &:focus
    {
        font-weight: normal;

        color: $color-mine-shaft;
        outline: none;
    }
    /**
     * When search input isn't focused,
     * and is empty - show placeholder
     */
    &:empty:not(:focus)::before
    {
        font-weight: normal;

        content: attr(data-placeholder);
        cursor: text;
        text-transform: capitalize;

        color: $color-text-placeholder;
        background: $color-white;
    }
}

.inline-select__options {
    height: 370px;
}
</style>