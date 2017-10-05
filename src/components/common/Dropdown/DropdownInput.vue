<template>
    <!--
      If dropdown is searchable, let user input search query
    -->
    <div v-if  = "searchable && !readonly"
         class = "dropdown__input-wrapper"
    >
      <input :placeholder   = "displayText"
              v-model       = "localValue"
              class         = "dropdown__input ------lastpass-search"
              type          = "text"
             @focus         = "$emit('focus', $event)"
             @blur          = "$emit('blur', $event)"
             @keydown       = "$emit('keydown', $event)"
      ></input>
    </div>

    <!--
      else just show simple div with current value or placeholder text
     -->
    <div v-else
         @click = "$emit('click', $event)"
          class = "dropdown__input"
         :class = "{ '--placeholder': !isValueSet }"
    >
      {{ displayText }}
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
    value: {
      required: true
    },
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
      console.log(val, this.value)
      if (this.value === val) {
        return
      }
      this.$emit('input', val)
    }
  }
}
</script>