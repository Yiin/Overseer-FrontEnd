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
      <div class="inline-select__options scrollable">
        <slot></slot>
      </div>
  </div>
</template>

<script>
import he from 'he'
const Medium = require('@/vendor/medium.js/medium.patched').Medium

export default {
  name: 'inline-select',

  props: ['placeholder', 'name'],

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
    options() {
      return this.$slots.default.map((option) => option.componentInstance)
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

    // name options and listen to input events
    this.options.forEach((option) => {
      option.name = this.name

      option.$on('input', (e) => {
        this.$emit('input', e)
      })
    })
  },

  methods: {
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

    clear() {
      this.medium.value('')
      this.query = ''
    }
  }
}
</script>

<style lang="scss">
.inline-select {
  margin-top: -40px;
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
  padding-bottom: 40px;
}
</style>