<template>
  <div class="dropdown__option dropdown__option--text">
    <div ref="input"
         class="dropdown__option--text-input mediumjs-input"
         :data-placeholder="placeholder"
    ></div>
    <div v-show="value && value.length"
         @click="clear"
         class="mediumjs-input-clear"
    ></div>
  </div>
</template>

<script>
import he from 'he'
const Medium = require('@/vendor/medium.js/medium.patched').Medium

export default {
  name: 'dropdown-text-option',

  props: {
    placeholder: {
      type: String
    },
    name: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      medium: null,
      value: ''
    }
  },

  methods: {
    clear() {
      this.medium.value('')
      this.$set(this, 'value', '')

      this.$emit('input-changed', {
        name: this.name,
        value: ''
      })
    },

    setValue(value) {
      value = he.decode(value).trim()
      this.medium.value(value)
      this.$set(this, 'value', value)
    }
  },

  mounted() {
    this.medium = new Medium({
      element: this.$refs.input,
      mode: Medium.inlineMode
    })

    this.$refs.input.addEventListener('keyup', () => {
      let value = this.medium.value().trim()

      if (this.value !== value) {
        this.$set(this, 'value', value)

        this.$emit('input-changed', {
          name: this.name,
          value: he.decode(this.value).trim()
        })
      }
    })
  }
}
</script>