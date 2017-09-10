<template>
  <div class="inline-select-column" :style="{ width: calculatedWidth, 'min-width': calculatedWidth, 'text-align': customAlign }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'inline-select-column',

  props: ['width', 'align'],

  data() {
    let width = this.width
    if (width && width.indexOf('%') > -1) {
      width = parseFloat(width.replace('%', '')) / 100
      width = `calc(${this.width} - (60px * ${width}))`
    }

    return {
      calculatedWidth: width,
      customAlign: this.align
    }
  },

  methods: {
    setWidth(width) {
      this.calculatedWidth = width
    },

    setAlign(align) {
      this.customAlign = align
    }
  }
}
</script>