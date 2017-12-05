<template>
  <div ref="dd"
       v-clickaway = "close"
       class       = "dropdown"
       tabindex    = "1"
      :class       = "{
        'dropdown--open': isOpen
      }"
      @keydown.self.enter.space = "toggle"
  >
    <dropdown-input
      v-if="!shouldBeReversed"
      :display-text="displayText"
      @focus="open"
      @blur="close"
      @keydown.enter="addOption"
      @click="toggle"
    ></dropdown-input>

    <!--
      dropdown list of options
     -->
    <div ref    = "dropdownOptions"
         v-show = "isOpen"
         class  = "dropdown__options-wrapper"
        :class  = "{
          'dropdown__options-wrapper--reversed': shouldBeReversed,
          'dropdown__options-wrapper--visible': isOpen
        }"
    >
      <!--
        user can use whatever dropdown-option components he wants
       -->
      <slot></slot>
    </div>

    <dropdown-input
      v-if="shouldBeReversed"
      :display-text="displayText"
      :readonly="readonly"
      @focus="open"
      @blur="close"
      @keydown.enter="addOption"
      @click="toggle"
      :class="{ '--focus': isOpen }"
    ></dropdown-input>
  </div>
</template>

<script>
import DropdownInput from './DropdownInput.vue'

export default {
  name: 'dropdown',

  components: {
    DropdownInput
  },

  props: {
    placeholder: {
      default: ''
    },
    watch: {
      default: undefined
    },
    value: {
      default: ''
    },
    shouldBeReversed: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isMounted: false,
      isOpen: false // should dropdown options list be visible?
    }
  },

  computed: {
    /**
     * Text that is displayed in dropdown field
     */
    displayText() {
      if (this.valueText) {
        return this.valueText || (typeof this.value === 'object' ? this.value.text : this.value)
      }
      return this.placeholder
    },

    /**
     * Returns array of dropdown options components
     */
    options() {
      /**
       * I was young and naive
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
     */
    inputs() {
      const inputs = {}

      this.options.forEach((option) => {
        if (typeof option.getValue === 'function' && option.getValue()) {
          inputs[option.name] = option.getValue()
        }
      })

      return inputs
    }
  },

  mounted() {
    this.isMounted = true
    this.initOptions()

    if (this.watch) {
      this.$watch(() => this.watch, this.recalculateOptions)
    }
  },

  methods: {
    recalculateOptions() {
      this.recalculateComputedProperty('options')
      this.$nextTick(() => {
        this.initOptions()
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

    initOptions() {
      if (!this.options.length) {
        return
      }
      this.initOptionsListeners()
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
      this.$emit('input', option)
    },

    resetValue() {
      this.options
        .forEach((option) => {
          option.uncheck()
        })
    },

    toggle() {
      if (this.readonly) {
        return
      }
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
      if (this.readonly) {
        return
      }
      this.query = ''
      this.isOpen = true
      this.$refs.dropdownOptions.scrollTop = 0
    }
  }
}
</script>

<style scoped>
.dropdown__options-wrapper {
  overflow: visible;
  max-height: initial;
}
</style>