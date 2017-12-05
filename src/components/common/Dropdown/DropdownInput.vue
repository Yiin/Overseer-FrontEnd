<template>
    <!--
      If dropdown is searchable, let user input search query
    -->
    <div v-if  = "searchable && !readonly"
         class = "dropdown__input-wrapper"
    >
      <input :placeholder   = "displayText"
              v-model       = "localValue"
              class         = "dropdown__input"
              type          = "text"
             @focus         = "$emit('focus', $event)"
             @blur          = "$emit('blur', $event)"
             @keydown       = "$emit('keydown', $event)"
             data-lpignore  = "true"
      ></input>
    </div>

    <!--
      else just show simple div with current value or placeholder text
     -->
    <div v-else
         class = "dropdown__input-wrapper"
    >
      <div
         @click = "$emit('click', $event)"
          class = "dropdown__input"
         :class = "{ '--placeholder': !isValueSet }"
      >
        {{ displayText }}
      </div>
    </div>
</template>

<script>
export default {
  props: {
    searchable: {
      type: Boolean
    },
    displayText: {
      type: [String, Number, Boolean]
    },
    isValueSet: {
      type: Boolean
    },
    value: {},
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localValue: this.value
    }
  },

  watch: {
    value(val) {
      if (this.localValue === val) {
        return
      }
      this.localValue = val
    },

    localValue(val) {
      if (this.value === val) {
        return
      }
      this.$emit('input', val)
    }
  }
}
</script>