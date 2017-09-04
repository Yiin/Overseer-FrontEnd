<template>
  <div v-clickaway="close"
       class="dropdown"
       tabindex="0"
      @keydown.enter.space="toggle"
      :class="{ 'dropdown--open': isOpen }"
  >
    <!--
      If dropdown is searchable, let user input search query
    -->
    <input v-if         = "searchable"
          :placeholder  = "placeholder"
           v-model      = "query"
           class        = "dropdown__input"
           type         = "text"
    ></input>

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
    <div v-show = "isOpen"
         class  = "dropdown__options"
    >
      <!--
        user can use whatever dropdown-option components he wants
       -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dropdown',

  props: ['placeholder', 'searchBy'],

  data() {
    return {
      isOpen: false, // should dropdown options list be visible?
      value: null, // current selected dropdown option value(s)
      query: '' // query to filter dropdown options
    }
  },

  computed: {
    isValueSet() {
      return this.value !== null
    },

    /**
     * Text that is displayed in dropdown field
     */
    displayText() {
      if (this.isValueSet) {
        return this.value
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
      if (!this.$slots || !this.$slots.default) {
        return []
      }
      return this.$slots.default
        .filter((slot) => slot.tag && slot.tag.indexOf('option') > -1)
        .map((el) => el.componentInstance)
        .filter((option) => option.value !== '__ALL__')
    },

    /**
     * Can we filter options using input field?
     */
    searchable() {
      return typeof this.searchBy !== 'undefined'
    },

    /**
     * Array of values from all checked options
     */
    values() {
      let values = []

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
    }
  },

  mounted() {
    this.initOptions()
  },

  methods: {
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
        this.setValue(option.value)
      }
    },

    initOptionsListeners() {
      /**
       * Classic simple singular options
       */
      this.options.forEach((option) => option.$on('select', (e) => {
        this.setValue(e.value)
        this.close()
      }))

      /**
       * Checkbox options (multiselect)
       */
      this.options.forEach((option) => option.$on('toggle', () => {
        this.$emit('input', this.values)
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
    },

    setValue(value) {
      this.value = value
      this.$emit('input', value)
    },

    resetValue() {
      this.options
        .forEach((option) => {
          option.uncheck()
        })
    },

    toggle() {
      this.isOpen = !this.isOpen
    },

    close() {
      this.isOpen = false
    },

    open() {
      this.isOpen = true
    }
  }
}
</script>