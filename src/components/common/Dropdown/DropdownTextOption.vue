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
const Medium = require('@/vendor/medium.js/medium.patched').Medium

export default {
  name: 'dropdown-text-option',

  props: ['placeholder'],

  data() {
    return {
      medium: null,
      value: ''
    }
  },

  render: function () {
    console.log(this.$slots)
  },

  methods: {
    clear() {
      this.medium.value('')
      this.value = ''

      this.$forceUpdate()
      this.$emit('changed')
    },

    setValue(value) {
      this.value = value
      this.medium.value(value)
      this.$forceUpdate()
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
        this.value = value

        this.$forceUpdate()
        this.$emit('changed')
      }
    })
  }
}
</script>