<template>
  <div ref="dd"
       v-clickaway = "close"
       class       = "dropdown"
       tabindex    = "0"
      :class       = "{ 'dropdown--open': isOpen, 'dropdown--primary': primary }"
      @keydown.self.enter.space = "toggle"
  >
    <!--
      If dropdown is searchable, let user input search query
    -->
    <div v-if  = "searchable"
         class = "dropdown__input-wrapper"
    >
      <input :placeholder   = "displayText"
              v-model       = "query"
              class         = "dropdown__input"
              type          = "text"
             @focus         = "open"
             @blur          = "close"
             @keydown.enter = "addOption"
      ></input>
    </div>

    <!--
      else just show simple div with current value or placeholder text
     -->
    <div v-else
         @click = "toggle"
          class = "dropdown__input"
         :class = "{ '--placeholder': !isValueSet }"
    >
      {{ displayText }}
    </div>

    <!--
      dropdown list of options
     -->
    <div ref    = "dropdownOptions"
         v-show = "isOpen && (visibleOptions.length || primary || (document && newEntryValue && query))"
         class  = "dropdown__options"
        :class  = "{
          'scrollable': isOpen && scrollable && visibleOptions.length > 5,
          'dropdown__options--reversed': shouldBeReversed
        }"
    >
      <dropdown-option v-if="document && newEntryValue && query">
        {{ query }}
      </dropdown-option>
      <!--
        user can use whatever dropdown-option components he wants
       -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import he from 'he'

export default {
  name: 'dropdown',

  props: {
    placeholder: {
      default: ''
    },
    searchable: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    primary: {
      type: Boolean,
      default: false
    },
    value: {
      default: ''
    },
    withText: {
      type: Boolean,
      default: false
    },
    watch: {
      default: undefined
    },
    document: {
      type: Boolean,
      default: false
    },
    newEntryValue: {
      type: String,
      default: undefined
    }
  },

  data() {
    return {
      isMounted: false,
      isOpen: false, // should dropdown options list be visible?
      query: '', // query to filter dropdown options,
      valueText: undefined
    }
  },

  computed: {
    /**
     * We're checking only some of the negatives, because value
     * can actually be both Boolean(false) and 0.
     * @return {Boolean} [description]
     */
    isValueSet() {
      if (typeof this.value === 'undefined') {
        return false
      }
      if (this.value === null) {
        return false
      }
      if (this.value === '') {
        return false
      }
      if (typeof this.value === 'object') {
        if (typeof this.value.value === 'undefined') {
          return false
        }
        if (this.value.value === null) {
          return false
        }
        if (this.value.value === '') {
          return false
        }
        if (!this.value.uuid && !this.value.id) {
          return false
        }
      }
      return true
    },

    /**
     * Text that is displayed in dropdown field
     */
    displayText() {
      if (this.isValueSet || this.valueText) {
        return this.valueText || (typeof this.value === 'object' ? this.value.text : this.value)
      }
      return this.placeholder
    },

    /**
     * Returns array of dropdown options components
     */
    options() {
      /**
       * A hack-ish way to access components of dropdown options
       */
      if (!this.isMounted || !this.$slots || !this.$slots.default) {
        return []
      }
      return this.$slots.default
        .filter((slot) => slot.tag && slot.tag.indexOf('option') > -1)
        .map((el) => {
          return el.componentInstance
        })
        .filter((option) => {
          return option && option.value !== '__ALL__'
        })
    },

    /**
     * List of visible options
     */
    visibleOptions() {
      return this.searchable ? this.options.filter((option) => option.isVisible) : this.options
    },

    /**
     * Array of values from all checked options
     */
    values() {
      const values = []

      for (let i = 0; i < this.options.length; ++i) {
        const option = this.options[i]

        if (option.options && option.options.length) {
          for (let j = 0; j < option.options.length; ++j) {
            if (option.options[j].isChecked) {
              values.push(option.options[j].value)
            }
          }
        } else {
          if (option.isChecked) {
            values.push(option.value)
          }
        }
      }
      return values
    },

    /**
     * Array of text inputs
     * @return {[type]} [description]
     */
    inputs() {
      const inputs = {}

      this.options.forEach((option) => {
        if (option.value) {
          inputs[option.name] = option.value
        }
      })

      return inputs
    },

    /**
     * Normalize query
     * @return {[type]} [description]
     */
    searchQuery() {
      return he.decode(this.query)
          .trim()
          .toLowerCase()
    },

    /**
     * Split query to search terms
     */
    searchTerms() {
      return (
          this.searchQuery
          .match(/[^\s"]+|"([^"]*)"/gi) || []
        ).map((term) => term.replace(/"/g, ''))
    },

    /**
     * If list of options is longer than available space
     * between dropdown and the window bottom, show list
     * above dropdown.
     */
    shouldBeReversed() {
      // update everytime visibleOptionsChanges
      if (!this.isOpen || !this.$refs.dropdownOptions) {
        return false
      }
      const rect = this.$refs.dropdownOptions.getBoundingClientRect()

      return rect.bottom > window.innerHeight
    }
  },

  watch: {
    query: function (query) {
      this.options.forEach((option) => {
        option.isVisible = this.shouldBeVisible(option)
      })
      if (this.document && this.newEntryValue) {
        // this.setValue({
        //   text: this.valueText || query,
        //   value: Object.assign({}, this.value, {
        //     uuid: null,
        //     [this.newEntryValue]: query
        //   })
        // })
      }
    },
    isOpen: function () {
      this.recalculateComputedProperty('shouldBeReversed')
    },
    visibleOptions: function () {
      this.recalculateComputedProperty('shouldBeReversed')
    },
    value: function (value) {
      if (typeof value === 'object' && typeof value.text !== 'undefined') {
        this.valueText = value.text
      } else {
        this.findAndSelect(value)
      }
      if (this.searchable) {
        this.query = this.valueText
      }
    }
  },

  mounted() {
    this.isMounted = true
    this.initOptions()

    if (this.watch) {
      this.$watch(() => this.watch, this.recalculateOptions)
    }
    if (this.value) {
      this.findAndSelect(this.value)
    }
  },

  methods: {
    recalculateOptions() {
      this.recalculateComputedProperty('options')
      this.$nextTick(() => {
        this.initOptions()
        this.recalculateComputedProperty('visibleOptions')

        this.setValue({
          text: '',
          value: ''
        })
      })
    },

    recalculateComputedProperty(property) {
      this.$nextTick(() => {
        this._computedWatchers[property].update()
        this.$forceUpdate()
      })
    },

    findAndSelect(value) {
      const option = this.options.find((option) => option.value === value)

      if (option) {
        option.select()
      }
    },

    addOption() {
      if (!this.addable) {
        return
      }

      this.addedOptions.unshift(he.decode(this.query).trim())
    },

    // option should be visible only
    shouldBeVisible(option) {
      // if we're not searching for anything specific
      if (!this.searchTerms.length) {
        return true
      }
      // or this option matches search terms
      const searchable = option.searchable
      const query = [this.searchQuery] // this.searchTerms

      for (let i = 0; i < query.length; ++i) {
        if (searchable.indexOf(query[i]) > -1) {
          return true
        }
      }
      // else ignore it completely
      return false
    },

    initOptions() {
      if (!this.options.length) {
        return
      }
      this.setDefaultValue()
      this.initOptionsListeners()
    },

    setDefaultValue() {
      let option = this.options.find((option) => option.selected)

      if (option) {
        this.setValue(option)
        return true
      }
      return false
    },

    initOptionsListeners() {
      /**
       * Classic simple singular options
       */
      this.options.forEach((option) => option.$on('select', (e) => {
        this.setValue(e)
        this.close()
      }))

      /**
       * Checkbox options (multiselect)
       */
      this.options.forEach((option) => option.$on('toggle', () => {
        this.$emit('input', this.values)
      }))

      /**
       * Text input options
       */
      this.options.forEach((option) => option.$on('input-changed', () => {
        this.$emit('input', this.inputs)
      }))

      /**
       * Options with children
       *
       * Only single option can be open at any given time.
       */
      this.options.forEach((option) => option.$on('open', (e) => {
        this.options.forEach((option) => {
          option.isOpen = (e === option)
        })
      }))

      this.options.forEach((option) => option.$on('change', () => {
        this.recalculateOptions()
      }))
    },

    setValue(option) {
      if (typeof option === 'object') {
        this.valueText = option.text

        if (this.withText) {
          this.$emit('input', {
            __valueWithText: true,
            value: option.value,
            text: option.text
          })
        } else {
          this.$emit('input', option.value)
        }
      } else {
        this.$emit('input', option)
      }
    },

    resetValue() {
      this.options
        .forEach((option) => {
          option.uncheck()
        })
    },

    toggle() {
      this.isOpen = !this.isOpen
      this.$refs.dropdownOptions.scrollTop = 0
    },

    close(ev) {
      if ((ev && !this.$refs.dd.contains(ev.target)) || !ev) {
        this.isOpen = false
        this.$refs.dropdownOptions.scrollTop = 0
      }
    },

    open() {
      this.query = ''
      this.isOpen = true
      this.$refs.dropdownOptions.scrollTop = 0
    }
  }
}
</script>