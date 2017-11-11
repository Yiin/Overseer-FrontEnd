<template>
  <div class="dropdown__option dropdown__option--text">
    <div
      class="dropdown__option--text-input mediumjs-input"
      :class="{
        'dropdown__option--focused': isFocused
      }"
      @mousedown="$refs.input.focus()"
    >
      <input
        :placeholder="placeholder"
        ref="input"
        type="text"
        v-model="localValue"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >
    </div>
    <div v-show="localValue && localValue.length"
         @click="clear"
         class="mediumjs-input-clear"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'dropdown-text-option',

  props: {
    placeholder: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    value: {}
  },

  data() {
    return {
      localValue: '',
      isFocused: false
    }
  },

  watch: {
    value(value) {
      if (value !== this.localValue) {
        this.localValue = value
      }
    },

    localValue(localValue) {
      this.$emit('input-changed', {
        name: this.name,
        value: localValue
      })
    }
  },

  methods: {
    clear() {
      this.localValue = ''
    },

    getValue() {
      return this.localValue
    }
  }
}
</script>

<style>
.mediumjs-input input {
  width: 100%;
  height: 100%;
}
</style>