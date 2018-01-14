<template lang="pug">
  .dropdown(
    :class='dropdownClasses'
    v-clickaway='hide'
  )
    //-
      List of dropdown options

    .dropdown__options-wrapper.scrollable(
      ref='reversibleEl'
      :class='dropdownWrapperClasses'
      :style='dropdownOptionsWrapperStyle'
      v-show='isOpen && hasOptions'
      @mousedown='focusOptions'
    )
      v-list.dropdown__options-list.md-list(:dense='dense')

        //-
          Display select all option, but only if multiple
          mode is set

        slot(name='customOptions')

        //-
          Display custom option, which will be added to list of custom
          items if user clicks on it

        v-list-tile(
          v-if='canAddItem'
          @click='addItem'
        )
          v-list-tile-action
            v-icon playlist_add
          v-list-tile-content
            v-list-tile-title {{ query }}
            v-list-tile-sub-title Add and Select

        //-
          List of added custom items

        template(v-for='item in filteredCustomItems')
          v-list-tile(ref='customOption' @click='selectCustom(item)')
            v-list-tile-action
              v-icon {{ customItemIcon }}

            v-list-tile-content
              v-list-tile-title {{ item }}
              v-list-tile-sub-title {{ customItemText }}

        //-
          List of filtered items

        template(v-for='(item, index) in filteredItems')
          v-divider(v-if='item.divider')
          v-subheader(v-else-if='item.header' v-text='item.header')
          slot(
            v-else-if='index < TOpen'
            name='option'
            :item='item'
            :selected='selectedItems.indexOf(getItemValue(item)) > -1'
            :index='index'
            :parent='_self'
          )
            v-list-tile(
              @click='select(item)'
            )

              //-
                Show checkbox if multiselect is enabled

              v-list-tile-action(v-if='multiple')
                x-checkbox(:checked='selectedItems.indexOf(getItemValue(item)) > -1')

              v-list-tile-content {{ item.text }}

    //-
      Dropdown input field

    .dropdown__input-wrapper

      //-
        Input field if we can search the items

      div(@click='onFocus')
        slot(name='activator' :parent='_self')
          template(v-if='!readonly && (searchable || allowCustom)')
            v-text-field(
              v-if='vuetify'
              v-model='inputText'
              :label='placeholder'
              data-lpignore='true'
              @mousedown='onFocus'
              @focus='onFocus'
              @blur='onBlur'
              @input='onInput'
              @keydown.enter='onEnter'
            )

            input.dropdown__input(
              v-else
              type='text'
              v-model='inputText'
              :placeholder='placeholder'
              data-lpignore='true'
              @mousedown='onFocus'
              @focus='onFocus'
              @blur='onBlur'
              @input='onInput'
              @keydown.enter='onEnter'
            )

          //-
            Static div if we can't search the items

          .dropdown__input(
            v-else
            @mousedown='onFocus'
            @focus='onFocus'
          ) {{ query || placeholder }}

</template>

<script>
import Toggleable from '@/mixins/properties/toggleable'
import Reversible from '@/mixins/properties/reversible'
import pluralize from 'pluralize'

export default {
  name: 'form-dropdown-input',

  mixins: [
    Toggleable,
    Reversible
  ],

  props: {
    debug: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    items: {
      type: [Array, Object],
      default: () => []
    },
    searchable: {
      type: Boolean,
      default: false
    },
    allowCustom: {
      type: Boolean,
      default: false
    },
    customItemIcon: {
      type: String,
      default: 'playlist_add_check'
    },
    customItemText: {
      type: String,
      default: 'Custom item'
    },
    vuetify: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    itemName: {
      type: String,
      default: 'item'
    },
    withSelectAllOption: {
      type: Boolean,
      default: false
    },
    withTitles: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: undefined
    },
    value: {}
  },

  data() {
    return {
      /**
       * Query that is used to filter options list
       *
       * @type {String}
       */
      query: '',

      /**
       * Reference to currently selected item,
       * which is used to check if we should
       * display option to add custom item.
       *
       * @type {object|string}
       */
      selectedItem: null,

      /**
       * Selected items when multiselect
       * is enabled
       *
       * @type {Array}
       */
      selectedItems: Array.isArray(this.value) ? this.value.slice() : [],

      /**
       * Used to check if user is currently typing,
       * so we can display filtered list when it does,
       * and full list if user simply clicked on the dropdown
       *
       * @type {Boolean}
       */
      isTyping: false,

      /**
       * Used to fix dropdown interaction, when user clicks on option,
       * @blur event gets called on input text, isTyping resets,
       * visible options resets because query is no longer applied
       * and user ends up clicking on the option he did not intended to
       * click on.
       */
      ignoreBlur: false,

      /**
       * Custom options added by user.
       *
       * @type {Array}
       */
      customItems: [],

      /**
       * If true, add all items to the selected items array.
       *
       * Applicable only if multiselect and withSelectAllOption
       * properties are enabled.
       *
       * @type {Boolean}
       */
      selectAll: false,
      selectNone: false,

      /**
       * Used to check if dropdown should be displayed
       * on top of the input box, instead of below.
       *
       * @type {[type]}
       */
      dropdownHeight: null,
      dropdownDistToBottom: null,

      TOpen: 0
    }
  },

  computed: {
    dropdownClasses() {
      return {
        'dropdown--open': this.isOpen,
        'dropdown--dense': this.dense
      }
    },

    dropdownWrapperClasses() {
      return {
        'dropdown__options-wrapper--reversed': this.isReversed,
        'dropdown__options-wrapper--visible': this.isOpen
      }
    },

    hasOptions() {
      if (!this.searchable) {
        return true
      }
      if (this.filteredItems.length) {
        return true
      }
      if (this.customItems.length) {
        return true
      }
      return false
    },

    inputText: {
      get() {
        if (this.multiple) {
          if (this.isTyping) {
            return this.query
          } else {
            if (this.selectedItems.length < 3) {
              const selectedItems = this.items.filter((item) => {
                return this.selectedItems.indexOf(this.getItemValue(item)) > -1
              })
              .map((item) => item.text)

              return selectedItems.join(', ')
            }
            return `Selected ${this.selectedItems.length} ${pluralize(this.itemName)}`
          }
        } else {
          return this.query
        }
      },
      set(value) {
        this.query = value
      }
    },

    filteredItems() {
      if (!this.isTyping) {
        if (this.withTitles) {
          return this.genTitles(this.items)
        }
        return this.items
      } else {
        if (this.withTitles) {
          return this.genTitles(this.items.filter(this.filterByQuery))
        }
        return this.items.filter(this.filterByQuery)
      }
    },

    filteredCustomItems() {
      if (!this.isTyping) {
        return this.customItems
      } else {
        return this.customItems.filter(this.filterByQuery)
      }
    },

    /**
     * Select all switch component should be read-only,
     * we change it's value manually anyways.
     */
    selectAllSwitch: {
      get() {
        return this.selectAll && !this.selectNone
      },
      set() {}
    },

    selectNoneSwitch: {
      get() {
        return this.selectNone && !this.selectAll
      },
      set() {}
    },

    values() {
      return this.items.map(this.getItemValue)
    },

    canAddItem() {
      if (!this.allowCustom) {
        return false
      }
      if (!this.query) {
        return false
      }
      if (this.customItems.indexOf(this.query) !== -1) {
        return false
      }
      if (this.selectedItem && this.selectedItem.value) {
        if (this.selectedItem.text === this.query) {
          return false
        }
      }
      return true
    },

    dropdownOptionsWrapperStyle() {
      const style = {}

      if (this.avatar) {
        style.maxHeight = '257px'
      }

      if (this.dropdownDistToBottom === null) {
        style.visibility = 'hidden'
      } else {
        const minSpaceToBottom = 10

        if (minSpaceToBottom > this.dropdownDistToBottom) {
          this.isReversed = true
        }
      }

      if (!this.isReversed && typeof this.top !== 'undefined') {
        style.top = this.top + 'px'
      }

      return style
    },

    serializedValue() {
      return Array.isArray(this.value) ? JSON.stringify(this.value) : this.value
    }
  },

  watch: {
    filteredItems() {
      if (this.isOpen) {
        this.calcDropdownSize()
      }
    },

    serializedValue(value, previous) {
      if (value !== previous) {
        this.selectByValue()
      }
    },

    isOpen(isOpen) {
      if (isOpen) {
        this.TOpen = 0
        requestAnimationFrame(() => {
          this.$refs.reversibleEl.scrollTop = 0
        })
        requestAnimationFrame(this.loadOptions)

        this.calcDropdownSize()
      } else {
        this.isTyping = false
        this.resetDropdownSize()
      }
    },

    isTyping(isTyping) {
      if (!isTyping) {
        if (this.selectedItem) {
          this.query = this.selectedItem.text
        } else {
          this.query = ''
        }
      }
    },

    items(items) {
      if (this.multiple) {
        if (this.selectAll) {
          items.map(this.select)
        }
        // filter out non existant items
        this.selectedItems = this.selectedItems.filter((value) => this.values.indexOf(value) > -1)
      }

      // Update selected item text if it changed
      if (this.selectedItem) {
        const item = items.find((item) => this.getItemValue(item) === this.getItemValue(this.selectedItem))

        this.selectedItem = item

        if (!this.isTyping) {
          this.inputText = item ? item.text : ''
        }
      } else if (this.value) {
        const item = items.find((item) => this.getItemValue(item) === this.value)

        this.selectedItem = item

        if (!this.isTyping) {
          this.inputText = item ? item.text : ''
        }
      }

      // Remove custom items, if items with same name exists in items list
      this.customItems = this.customItems.filter((item) => {
        return items.findIndex((existingItem) => {
          return existingItem.text === item
        }) < 0
      })
    }
  },

  mounted() {
    this.selectByValue()
  },

  methods: {
    input(text) {
      this.inputText = text
      this.onInput()
    },

    loadOptions() {
      if (!this.isOpen) {
        return
      }
      if (this.TOpen >= this.filteredItems.length) {
        return
      }
      this.TOpen += 10 + this.TOpen
      setTimeout(this.loadOptions, 50)
    },

    genTitles(items) {
      const options = []

      let lastChar = null

      items.sort((a, b) => {
        const [ aText, bText ] = [ a.text.toUpperCase(), b.text.toUpperCase() ]

        if (aText < bText) {
          return -1
        } else if (aText > bText) {
          return 1
        } else {
          return 0
        }
      })

      items.forEach((item) => {
        const currentChar = item.text[0].toUpperCase()

        if (!lastChar || currentChar !== lastChar) {
          options.push({ header: currentChar })
          lastChar = currentChar
        }
        options.push(item)
      })

      return options
    },

    calcDropdownSize() {
      this.$ready(() => {
        if (!this.$refs.reversibleEl) {
          return
        }

        const bcr = this.$refs.reversibleEl.getBoundingClientRect()

        this.dropdownDistToBottom = window.innerHeight - bcr.bottom
      })
    },

    resetDropdownSize() {
      this.dropdownDistToBottom = null
    },

    filterByQuery(item) {
      return (typeof item === 'string' ? item : item.text).toLowerCase().indexOf(this.query.toLowerCase()) > -1
    },

    selectByValue() {
      if ((this.multiple && !this.value.length) || this.value === null) {
        this.selectedItems = []
        this.selectedItem = null

        if (!this.isTyping) {
          this.query = ''
        }
      }
      if (this.multiple) {
        const availableSelectedItems = this.value.filter((item) => this.values.indexOf(item) > -1)

        const selectedItemsCmp = this.selectedItems.sort().toString()
        const availableSelectedItemsCmp = availableSelectedItems.sort().toString()

        if (selectedItemsCmp !== availableSelectedItemsCmp) {
          this.selectedItems = availableSelectedItems
          this.$emit('input', this.selectedItems)
        }
      } else {
        const item = this.items.find((item) => {
          return this.getItemValue(item) === this.value
        }) || null

        if (item) {
          this.select(item)
        }
      }
    },

    addItem() {
      this.customItems.push(this.query)
      this.selectCustom(this.query)
    },

    addAllItems() {
      this.selectAll = !this.selectAll

      if (this.selectAll) {
        this.items.map(this.select)
      } else {
        this.selectedItems = []
        this.$emit('input', this.selectedItems)
      }
    },

    selectCustom(text) {
      this.selectedItem = {
        text
      }
      this.query = text
      this.$emit('input-custom', text)
      this.hide()
    },

    select(item) {
      const value = this.getItemValue(item)

      if (this.multiple) {
        if (this.ignoreBlur) {
          this.ignoreBlur = false
        }
        if (this.selectedItems.indexOf(value) > -1) {
          // unselect selected item only if selectAll is not set
          if (!this.selectAll) {
            this.selectedItems = this.selectedItems.filter((selectedItem) => {
              return selectedItem !== value
            })
          }
        } else {
          this.selectedItems.push(value)
        }
        this.$emit('input', this.selectedItems)
      } else {
        this.selectedItem = item

        this.query = item.text
        this.$emit('input', value)
        this.hide()
      }
    },

    getItemValue(item) {
      if ('value' in item) {
        return item.value
      } else {
        return item.text
      }
    },

    focusOptions() {
      this.ignoreBlur = true
    },

    onEnter() {
      if (this.canAddItem) {
        this.addItem()
        this.hide()
      }
    },

    onFocus() {
      if (this.readonly) {
        return
      }
      if (this.multiple) {
        this.query = ''
        this.onInput()
      }
      this.show()
    },

    onBlur() {
      if (this.ignoreBlur) {
        return
      }
      if (this.multiple) {
        this.isTyping = false
      }
    },

    onInput() {
      this.isTyping = true
    }
  }
}
</script>

<style lang="scss">
.form .dropdown {
  line-height: initial;
}

.list--dense .list__tile__sub-title {
  padding: 0 0 6px;
}

.list--dense .list__tile:not(.list__tile--avatar) {
  height: 44px;
}

.dropdown--dense {
  .dropdown__options-wrapper:not(.dropdown__options-wrapper--reversed) {
    top: 48px;
  }
  .list--dense .list__tile__title,
  .list--dense .list__tile__sub-title {
    font-size: 14px;
  }
}

.dropdown {
  .input-group__input {
    padding-right: 30px;
  }
}

.dropdown__options-wrapper {
  position: absolute;
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;

  padding-top: 17px;
  padding-bottom: 17px;

  border: 1px solid #e2e2e2;
  border-top: 1px solid #ebebeb;
  border-radius: 0 0 $border-radius $border-radius;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .02);

  opacity: 0;
  pointer-events: none;

  &--reversed {
    bottom: 44px;
  }
  &--visible {
    opacity: 1;
    pointer-events: initial;
  }
  &:not(&--reversed) {
    top: 44px;
  }
}
</style>