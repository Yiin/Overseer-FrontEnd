<template>
  <div class="dropdown__option dropdown__option--nested" @click.self="toggle" @mouseover="show" v-clickaway="hide">
    <div class="option-label" @click.self="toggle">
      <slot name="label"></slot>
    </div>
    <div v-show="isOpen" class="dropdown__childs-menu">
      <div class="dropdown__child-search-wrapper">
        <div ref="searchInput"
             :data-placeholder="$t('placeholders.type_in_or_select')"
             class="dropdown__child-search mediumjs-input"></div>

        <div v-show="query && query.length"
             @click="clear"
             class="mediumjs-input-clear"
        ></div>
      </div>

      <div class="dropdown__child-options" :class="{ scrollable: visibleOptions.length >= 10 }">
        <slot name="options"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import he from 'he'
const Medium = require('@/vendor/medium.js/medium.patched').Medium

export default {
  name: 'dropdown-childs-option',

  props: {
    watch: {
      default: null
    }
  },

  data() {
    return {
      isOpen: false,
      medium: null,
      query: ''
    }
  },

  watch: {
    isOpen: function (isOpen) {
      if (isOpen) {
        this.$emit('open', this)
      }
    },
    query: function () {
      this.options.forEach((option) => {
        option.isVisible = this.shouldBeVisible(option)
      })
    }
  },

  computed: {
    options() {
      return this.$slots.options
        .filter((option) => option && option.componentInstance)
        .map((option) => option.componentInstance)
    },

    visibleOptions() {
      return this.options.filter((option) => option && option.isVisible)
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

        this.$forceUpdate()
      }
    })

    if (this.watch) {
      this.$watch(() => this.watch, () => {
        this.recalculateComputedProperty('options')
        this.recalculateComputedProperty('visibleOptions')
        this.$nextTick(() => {
          this.initOptions()
          this.$emit('changed')
        })
      })
    }
    this.recalculateComputedProperty('options')
    this.recalculateComputedProperty('visibleOptions')

    this.$nextTick(() => {
      this.initOptions()
    })
  },

  methods: {
    initOptions() {
      this.options.forEach((option) => {
        option.$on('toggle', (e) => {
          this.$emit('toggle', e)
        })
      })
    },

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
      const query = he.decode(this.query).trim().toLowerCase().split(' ')

      for (let i = 0; i < query.length; ++i) {
        if (searchable.indexOf(query[i]) > -1) {
          return true
        }
      }
      // else ignore it completely
      return false
    },

    uncheck() {
      this.options.forEach((option) => {
        option.uncheck()
      })
    },

    clear() {
      this.medium.value('')
      this.query = ''
    },

    toggle() {
      this.isOpen = !this.isOpen
    },

    show() {
      this.isOpen = true
    },

    hide() {
      this.isOpen = false
    }
  }
}
</script>

<style>
.dropdown__child-options.scrollable {
  max-height: 310px;
  margin-right: 10px;
}
</style>