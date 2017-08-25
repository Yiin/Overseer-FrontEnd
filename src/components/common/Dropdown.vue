<template>
  <div v-clickaway="close" class="dropdown" :class="{ 'dropdown--open': isOpen }">
    <!--
      if dropdown is searchable, let user input search query
    -->
    <input v-if         = "searchable"
           :placeholder = "placeholder"
           v-model      = "query"
           class        = "dropdown__input"
           type         = "text"
    ></input>

    <!--
      else just show simple div with current value or placeholder text
     -->
    <div v-else
         @click = "toggle"
         class  = "dropdown__input"
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
    /**
     * Text that is displayed in dropdown field
     */
    displayText() {
      if (this.value) {
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
      return this.$slots.default.filter((slot) => slot.tag.indexOf('option') > -1).map((el) => el.componentInstance)
    },

    /**
     * Can we filter options using input field?
     */
    searchable() {
      return typeof this.searchBy !== 'undefined'
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

      if (!option) {
        option = this.options[0]
      }
      this.setValue(option)
    },

    setValue(option) {
      this.options.forEach((_option) => {
        _option.isSelected = _option === option
      })

      this.value = option.value
    },

    initOptionsListeners() {
      this.options.forEach((option) => option.$on('select', (e) => {
        this.setValue(e)
        this.close()
      }))
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