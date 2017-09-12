<template>
  <div class="column" :style="{ width: cssWidth }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'column',

  props: ['width'],

  computed: {
    cssWidth() {
      const value = parseFloat(this.width.replace('%', '')) / 100

      return `calc((100% - 63px) * ${value})`
    }
  }
}
</script>