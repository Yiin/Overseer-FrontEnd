<template>
  <div v-show="isVisible" class="inline-option" @click="$refs.input.click()">
    <input :readonly="readonly" :name="name" ref="input" @click="click" :value="value" type="radio" class="radio-option">
    <div class="inline-option__label">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import he from 'he'

export default {
  name: 'inline-option',

  props: {
    value: {
      default: null
    },
    selected: {
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      name: '',
      isVisible: true
    }
  },

  watch: {
    selected(val) {
      if (val) {
        this.$refs.input.click()
      }
    }
  },

  computed: {
    searchable() {
      return he.decode(this.$slots.default[0].text).trim()
    }
  },

  methods: {
    click() {
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="scss">
.inline-option {
  height: 53px;
  line-height: 53px;
  border-top: 1px solid #e1e1e1;
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-right: 20px;
  cursor: default;

  &__label {
    display: inline-block;

    margin-left: 22px;
  }
}
</style>