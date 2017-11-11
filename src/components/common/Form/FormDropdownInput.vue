<template>
  <div
    class="dropdown"
    :class="{
      'dropdown--open': isOpen,
      'dropdown--dense': dense
    }"
    v-clickaway="hide"
  >
    <!--
      List of dropdown options
    -->
    <div
      ref="reversibleEl"
      class="dropdown__options-wrapper scrollable"
      :class="{
        'dropdown__options-wrapper--reversed': isReversed,
        'dropdown__options-wrapper--visible': isOpen
      }"
      v-if="isOpen"
    >
      <v-list class="dropdown__options-list" :dense="dense">
        <v-list-tile
          v-if="canAddItem"
          @click="addItem"
        >
          <v-list-tile-action>
            <v-icon>playlist_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ query }}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              Add and Select
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <template v-for="item in filteredCustomItems">
          <v-list-tile @click="selectCustom(item)">
            <v-list-tile-action>
              <v-icon>playlist_add_check</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                Custom item
              </v-list-tile-sub-title>
            </v-list-tile-content>
            </v-list-tile>
        </template>
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
      <template v-if="!readonly && (searchable || allowCustom)">
        <v-text-field
          v-if="vuetify"
          v-model="query"
          :label="placeholder"
          data-lpignore="true"
          @mousedown="onFocus"
          @focus="onFocus"
          @input="onInput"
        ></v-text-field>
        <input
          v-else
          type="text"
          v-model="query"
          :placeholder="placeholder"
          class="dropdown__input"
          data-lpignore="true"
          @mousedown="onFocus"
          @focus="onFocus"
          @input="onInput"
        >
      </template>
      <div
        v-else
        class="dropdown__input"
        @mousedown="onFocus"
        @focus="onFocus"
      >
        {{ query || placeholder }}
      </div>
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
    searchable: {
      type: Boolean,
      default: false
    },
    allowCustom: {
      type: Boolean,
      default: false
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
    value: {}
  },

  data() {
    return {
      query: '',
      selectedItem: null,
      isTyping: false,
      customItems: []
    }
  },

  computed: {
    filteredItems() {
      if (!this.isTyping) {
        return this.items
      } else {
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
      return (typeof item === 'string' ? item : item.text).toLowerCase().indexOf(this.query.toLowerCase()) > -1
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

    addItem() {
      this.customItems.push(this.query)
      this.selectCustom(this.query)
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
      if (this.readonly) {
        return
      }
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