<template>
  <div class="column" :style="{ width: cssWidth }" :class="{ copied: justCopied }">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'column',

  props: ['width', 'copy'],

  data() {
    return {
      justCopied: false
    }
  },

  computed: {
    cssWidth() {
      const value = parseFloat(this.width.replace('%', '')) / 100

      return `calc((100% - 63px) * ${value})`
    }
  },

  methods: {
    getText() {
      if (!this.$slots) {
        return
      }
      if (!this.$slots.default) {
        return
      }
      if (!this.$slots.default.length) {
        return
      }
      if (!this.$slots.default[0].elm) {
        return
      }
      console.log(this.$slots.default[0].elm.textContent)
      return this.$slots.default[0].elm.textContent
    },

    onCopy: function () {
      this.justCopied = true
      setTimeout(() => {
        this.justCopied = false
      }, 500)
    },

    onError: function (e) {
      alert('Failed to copy texts')
      console.log(e)
    }
  }
}
</script>

<style>
.copied {
  background: #5867c2;
  color: white;
  font-weight: 600;
  transition: all 0.5s;
}
</style>