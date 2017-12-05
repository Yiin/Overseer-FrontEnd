<template lang="pug">
  .checkbox(
    :class='classes'
    @click='toggle'
  )
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },

    checked: {
      type: Boolean,
      default: false
    },

    center: {
      type: Boolean,
      default: false
    },

    manual: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isChecked: this.value
    }
  },

  computed: {
    classes() {
      return {
        'checkbox--checked': this.checked || this.isChecked,
        'checkbox--center': this.center
      }
    }
  },

  watch: {
    value(value) {
      this.isChecked = value
    }
  },

  methods: {
    toggle() {
      if (this.manual) {
        return
      }
      this.$emit('input', !this.isChecked)
    }
  }
}
</script>

<style lang="scss">
/* Checkbox */
.checkbox
{
    position: relative;

    display: block;

    width: 22px;
    height: 22px;
    margin: 0;
    &--center
    {
        margin: 0 auto;
    }
    &::before
    {
        position: relative;
        top: 0;
        left: 0;

        display: block;

        box-sizing: border-box;
        width: 22px;
        height: 22px;

        content: '';

        border: 2px solid $color-main-dark;
        background: $color-white;
    }
    &--checked::after
    {
        position: absolute;
        top: 6px;
        left: 6px;

        width: 10px;
        height: 10px;

        content: '';

        background: $color-main;
    }
}
</style>