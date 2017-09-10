<template>
  <div class="form__inputs-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'form-inputs-group',

  computed: {
    inputs() {
      return this.$slots.default
        .filter((el) => el.tag && el.tag.indexOf('input') > -1)
        .map((el) => el.componentInstance)
    }
  }
}
</script>