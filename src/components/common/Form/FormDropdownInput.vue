<template>
  <div class="dropdown" v-clickaway="hide">
    <!--
      List of dropdown options
    -->
    <div
      ref="reversibleEl"
      class="dropdown__options-wrapper"
      :class="{
        'dropdown__options-wrapper--reversed': isReversed,
        'dropdown__options-wrapper--visible': isOpen
      }"
    >
      <v-list class="dropdown__options-list">
        <template v-for="(item, index) in filteredItems">
          <slot name="option" :item="item" :index="index" :parent="_self">
            <v-list-tile @click="select(item)">
              {{ item.text }}
            </v-list-tile>
          </slot>
        </template>
      </v-list>
    </div>

    <!--
      Dropdown input field below options, visible
      when there is not enough space for options
      between input ant bottom of the screen.
    -->
    <div class="dropdown__input-wrapper">
      <input
        type="text"
        v-model="query"
        :placeholder="placeholder"
        class="dropdown__input"
        data-lpignore="true"
        @mousedown="show"
        @focus="onFocus"
        @input="onInput"
      >
    </div>
  </div>
</template>

<script>
import Toggleable from '@/mixins/properties/toggleable'
import Reversible from '@/mixins/properties/reversible'

export default {
  name: 'form-dropdown-input',

  mixins: [
    Toggleable,
    Reversible
  ],

  props: {
    placeholder: {
      type: String,
      default: ''
    },
    items: {
      type: [Array, Object],
      default: () => []
    },
    value: {}
  },

  data() {
    return {
      query: '',
      selectedItem: null,
      isTyping: false
    }
  },

  computed: {
    filteredItems() {
      if (!this.isTyping) {
        return this.items
      } else {
        return this.items.filter(this.filterByQuery)
      }
    }
  },

  watch: {
    filteredItems() {
      this.updateReversible()
    },

    value() {
      this.selectByValue()
    },

    isOpen(isOpen) {
      if (!isOpen) {
        this.isTyping = false
      }
      this.updateReversible()
    },

    isTyping(isTyping) {
      if (!isTyping) {
        if (this.selectedItem) {
          this.query = this.selectedItem.text
        } else {
          this.query = ''
        }
      }
    }
  },

  mounted() {
    this.selectByValue()
  },

  methods: {
    filterByQuery(item) {
      return item.text.toLowerCase().indexOf(this.query.toLowerCase()) > -1
    },

    selectByValue() {
      const item = this.items.find((item) => {
        if (typeof item.value !== 'undefined') {
          return item.value === this.value
        } else {
          return item.text === this.value
        }
      }) || null

      if (item) {
        this.select(item)
      }
    },

    select(item) {
      let value

      if (typeof item.value !== 'undefined') {
        value = item.value
      } else {
        value = item.text
      }
      this.selectedItem = item

      this.query = item.text
      this.$emit('input', value)
      this.hide()
    },

    onFocus() {
      this.show()
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
    z-index: 0;
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