<template>
  <div v-show="isVisible" @click="check" class="dropdown__option dropdown__option--checkbox">
    <input @click.prevent class="checkbox" type="checkbox" v-model="isChecked">
    <div class="option-label">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dropdown-checkbox-option',

  props: {
    value: {
      required: true
    },
    checked: {
      default: false
    },
    searchable: {
      default: ''
    }
  },

  data() {
    return {
      isVisible: true,
      isChecked: false
    }
  },

  mounted() {
    if (this.checked) {
      this.check()
    }
  },

  methods: {
    check() {
      this.isChecked = !this.isChecked
      this.$emit('toggle', {
        value: this.value,
        isChecked: this.isChecked
      })
    },

    uncheck() {
      this.isChecked = false
    }
  }
}
</script>