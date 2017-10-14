<template>
  <div ref="dropdown"
    v-clickaway="close"
    class="dropdown"
  >
    <dropdown-input
      v-if="!shouldBeReversed"
      :searchable="searchable"
      :display-text="displayText"
      :is-value-set="isValueSet"
      :readonly="readonly"
      v-model="query"
    ></dropdown-input>
  </div>
</template>

<script>
import DropdownInput from './DropdownInput.vue'

export default {
  components: {
    DropdownInput
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    itemText: {
      type: [String, Number]
    },
    itemValue: {
      type: [String, Number, Boolean, Function]
    },
    searchable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onSelect(item) {
      if (typeof item === 'object') {
        if (typeof this.itemValue === 'function') {
          this.$emit('input', this.itemValue(item))
        } else if (typeof this.itemValue !== 'undefined') {
          this.$emit('input', item[this.itemValue])
        }
      }
      this.$emit('input', item)
    }
  }
}
</script>